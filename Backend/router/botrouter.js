const express = require("express");
const { chat } = require("../service/botservice");
const { chatLimiter } = require("../middleware/rateLimit");
const router = express.Router();


router.post("/chat", chatLimiter, async (req, res) => {
  await chat(req, res);
});

module.exports = router;
