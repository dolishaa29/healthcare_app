const express = require("express");
const {  chat } = require("../service/botservice");
const router = express.Router();


router.post("/chat", async (req, res) => {
  await chat(req, res);
});

module.exports = router;
