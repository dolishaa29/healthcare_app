let Message = require("../model/Message");
let appointmentnew = require("../model/Appointment/appointment");

exports.getUserConversations = async (req, res) => {
    try {
        const user = req.user;
        let appointments = await appointmentnew.find({ userid: user._id.toString() });

        let seen = new Set();
        let conversations = [];
        for (let appt of appointments) {
            if (!seen.has(appt.doctorid)) {
                seen.add(appt.doctorid);
                conversations.push({ userId: user._id.toString(), doctorId: appt.doctorid, doctormail: appt.doctormail });
            }
        }

        return res.status(200).json({ success: true, conversations });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err.message });
    }
};

exports.getDoctorConversations = async (req, res) => {
    try {
        const doctor = req.doctor;
        let appointments = await appointmentnew.find({ doctorid: doctor._id.toString() });

        let seen = new Set();
        let conversations = [];
        for (let appt of appointments) {
            if (!seen.has(appt.userid)) {
                seen.add(appt.userid);
                conversations.push({ doctorId: doctor._id.toString(), userId: appt.userid, name: appt.name, email: appt.email });
            }
        }

        return res.status(200).json({ success: true, conversations });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err.message });
    }
};

exports.getHistoryForUser = async (req, res) => {
    try {
        const user = req.user;
        const doctorId = req.params.doctorId;

        let messages = await Message.find({ userId: user._id.toString(), doctorId }).sort({ createdAt: 1 });
        return res.status(200).json({ success: true, messages });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err.message });
    }
};

exports.getHistoryForDoctor = async (req, res) => {
    try {
        const doctor = req.doctor;
        const userId = req.params.userId;

        let messages = await Message.find({ userId, doctorId: doctor._id.toString() }).sort({ createdAt: 1 });
        return res.status(200).json({ success: true, messages });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err.message });
    }
};

// used internally by the socket server when a message is sent in real time
exports.saveMessage = async ({ userId, doctorId, senderRole, text }) => {
    let message = new Message({ userId, doctorId, senderRole, text });
    await message.save();
    return message;
};
