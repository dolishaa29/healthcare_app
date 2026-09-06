const express = require("express");
const { chat } = require("../service/botservice");
const { chatLimiter } = require("../middleware/rateLimit");
const optionalAuth = require("../middleware/optionalAuth");
const router = express.Router();


router.post("/chat", optionalAuth, chatLimiter, async (req, res) => {
  await chat(req, res);
});

module.exports = router;
