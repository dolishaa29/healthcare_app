const Appointment = require("../model/Appointment/appointment");

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

async function leaveCurrentRoom(io, socket) {
    const roomId = socket.data.meetingRoomId;
    if (!roomId) return;

    socket.leave(roomId);
    socket.data.meetingRoomId = null;

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

            const existing = await io.in(roomId).fetchSockets();

            if (existing.length >= 2 && !existing.some((s) => s.id === socket.id)) {
                return socket.emit("meetingError", { msg: "This meeting already has two participants" });
            }

            await leaveCurrentRoom(io, socket);

            socket.join(roomId);
            socket.data.meetingRoomId = roomId;

            const peers = existing
                .filter((s) => s.id !== socket.id)
                .map((s) => ({ socketId: s.id, role: s.data.role, profileId: s.data.profileId, name: s.data.name }));

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
        if (socket.data.meetingRoomId !== roomId) return;
        socket.to(roomId).emit("signal", { from: socket.id, data });
    });

    socket.on("leave-meeting", async () => {
        await leaveCurrentRoom(io, socket);
    });
}

async function handleMeetingDisconnect(io, socket) {
    await leaveCurrentRoom(io, socket);
}

module.exports = { registerMeetingHandlers, handleMeetingDisconnect };
