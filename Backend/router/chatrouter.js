let express = require("express");
let userAuth = require("../middleware/user");
let doctorAuth = require("../middleware/doctor");
const { getUserConversations, getDoctorConversations, getHistoryForUser, getHistoryForDoctor } = require("../service/chatservice");

let router = express.Router();

router.get("/chat/user/conversations", userAuth, getUserConversations);
router.get("/chat/doctor/conversations", doctorAuth, getDoctorConversations);

router.get("/chat/user/history/:doctorId", userAuth, getHistoryForUser);
router.get("/chat/doctor/history/:userId", doctorAuth, getHistoryForDoctor);

module.exports = router;
