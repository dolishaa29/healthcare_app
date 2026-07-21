const Appointment = require("../model/Appointment/appointment");

// roomId -> Map<socketId, { role, profileId, name }>
const rooms = new Map();
// socketId -> roomId (a socket is only ever in one meeting at a time)
const socketRoom = new Map();

function meetingRoomId(appointmentId) {
    return `meeting_${appointmentId}`;
}

function isAuthorized(appointment, socket) {
    if (socket.role === "user") {
        return String(appointment.userid) === String(socket.profile._id);
    }
    if (socket.role === "doctor") {
        return String(appointment.doctorid) === String(socket.profile._id);
    }
    return false;
}

function hasMeetingStarted(appointment) {
    const scheduledAt = new Date(`${appointment.date}T${appointment.time}`);
    return Date.now() >= scheduledAt.getTime();
}

function leaveCurrentRoom(io, socket) {
    const roomId = socketRoom.get(socket.id);
    if (!roomId) return;

    socket.leave(roomId);
    socketRoom.delete(socket.id);

    const participants = rooms.get(roomId);
    if (participants) {
        participants.delete(socket.id);
        if (participants.size === 0) {
            rooms.delete(roomId);
        }
    }

    socket.to(roomId).emit("peer-left", { socketId: socket.id });
}

function registerMeetingHandlers(io, socket) {
    socket.on("join-meeting", async ({ appointmentId }) => {
        try {
            if (!appointmentId) {
                return socket.emit("meetingError", { msg: "appointmentId is required" });
            }

            const appointment = await Appointment.findById(appointmentId);
            if (!appointment) {
                return socket.emit("meetingError", { msg: "Appointment not found" });
            }

            if (!isAuthorized(appointment, socket)) {
                return socket.emit("meetingError", { msg: "You are not part of this appointment" });
            }

            if (!hasMeetingStarted(appointment)) {
                return socket.emit("meetingError", { msg: "This meeting has not started yet" });
            }

            const roomId = meetingRoomId(appointmentId);
            let participants = rooms.get(roomId);
            if (!participants) {
                participants = new Map();
                rooms.set(roomId, participants);
            }

            if (participants.size >= 2 && !participants.has(socket.id)) {
                return socket.emit("meetingError", { msg: "This meeting already has two participants" });
            }

            // Leave any stale room this socket thinks it's in first
            leaveCurrentRoom(io, socket);

            socket.join(roomId);
            socketRoom.set(socket.id, roomId);
            participants.set(socket.id, {
                role: socket.role,
                profileId: String(socket.profile._id),
                name: socket.profile.name,
            });

            const peers = [...participants.entries()]
                .filter(([id]) => id !== socket.id)
                .map(([socketId, info]) => ({ socketId, ...info }));

            socket.emit("joined-meeting", { selfId: socket.id, peers });
            socket.to(roomId).emit("peer-joined", {
                socketId: socket.id,
                role: socket.role,
                name: socket.profile.name,
            });
        } catch (err) {
            socket.emit("meetingError", { msg: "Failed to join meeting" });
        }
    });

    socket.on("signal", ({ appointmentId, data }) => {
        if (!appointmentId || !data) return;
        const roomId = meetingRoomId(appointmentId);
        if (socketRoom.get(socket.id) !== roomId) return;
        socket.to(roomId).emit("signal", { from: socket.id, data });
    });

    socket.on("leave-meeting", () => {
        leaveCurrentRoom(io, socket);
    });
}

function handleMeetingDisconnect(io, socket) {
    leaveCurrentRoom(io, socket);
}

module.exports = { registerMeetingHandlers, handleMeetingDisconnect };
