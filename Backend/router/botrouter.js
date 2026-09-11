const express = require("express");
const { chat, chatStream } = require("../service/botservice");
const { chatLimiter } = require("../middleware/rateLimit");
const router = express.Router();


router.post("/chat", chatLimiter, async (req, res) => {
  await chat(req, res);
});

router.post("/chat/stream", chatLimiter, async (req, res) => {
  await chatStream(req, res);
});

module.exports = router;
