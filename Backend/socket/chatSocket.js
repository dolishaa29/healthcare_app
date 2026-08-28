const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const jwt = require("jsonwebtoken");
const usermodel = require("../model/user");
const doctormodel = require("../model/doctor");
const { saveMessage } = require("../service/chatservice");
const { registerMeetingHandlers, handleMeetingDisconnect } = require("./meetingSocket");
const allowedOrigins = require("../config/corsOrigins");
const { getRedisClients } = require("../config/redisClient");

function roomId(userId, doctorId) {
    return `chat_${userId}_${doctorId}`;
}

async function initChatSocket(server) {
    const { pubClient, subClient } = await getRedisClients();

    const io = new Server(server, {
        cors: {
            origin: allowedOrigins,
            credentials: true,
        },
    });

    io.adapter(createAdapter(pubClient, subClient));

    io.use(async (socket, next) => {
        try {
            const { token, role } = socket.handshake.auth || {};

            if (!token || !role) {
                return next(new Error("Authentication required"));
            }

            const data = jwt.verify(token, process.env.JWT_SECRET);

            if (role === "user") {
                let user = await usermodel.findOne({ email: data.token });
                if (!user) return next(new Error("User not found"));
                socket.role = "user";
                socket.profile = user;
            } else if (role === "doctor") {
                let doctor = await doctormodel.findOne({ email: data.token });
                if (!doctor) return next(new Error("Doctor not found"));
                socket.role = "doctor";
                socket.profile = doctor;
            } else {
                return next(new Error("Invalid role"));
            }
            socket.data.role = socket.role;
            socket.data.profileId = String(socket.profile._id);
            socket.data.name = socket.profile.name;

            next();
        } catch (err) {
            next(new Error("Authentication failed"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`${socket.role} connected to chat: ${socket.profile._id}`);

        registerMeetingHandlers(io, socket);

        socket.on("joinConversation", ({ userId, doctorId }) => {
            if (!userId || !doctorId) return;
            socket.join(roomId(userId, doctorId));
        });

        
        socket.on("sendMessage", async ({ userId, doctorId, text }) => {
            try {
                if (!userId || !doctorId || !text || !text.trim()) return;

                const message = await saveMessage({
                    userId,
                    doctorId,
                    senderRole: socket.role,
                    text: text.trim(),
                });

                io.to(roomId(userId, doctorId)).emit("receiveMessage", message);
            } catch (err) {
                socket.emit("chatError", { msg: "Failed to send message" });
            }
        });

        socket.on("disconnect", () => {
            console.log(`${socket.role} disconnected from chat: ${socket.profile._id}`);
            handleMeetingDisconnect(io, socket);
        });
    });

    return io;
}

module.exports = initChatSocket;
