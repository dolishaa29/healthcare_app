const { getUserConversations, getDoctorConversations, getHistoryForUser, getHistoryForDoctor } = require("../service/chatservice");

exports.getUserConversations = async (req, res) => {
    await getUserConversations(req, res);
}

exports.getDoctorConversations = async (req, res) => {
    await getDoctorConversations(req, res);
}

exports.getHistoryForUser = async (req, res) => {
    await getHistoryForUser(req, res);
}

exports.getHistoryForDoctor = async (req, res) => {
    await getHistoryForDoctor(req, res);
}
