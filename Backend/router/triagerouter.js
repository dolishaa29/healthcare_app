const express = require("express");
const { triage } = require("../service/triageservice");
const { triageLimiter } = require("../middleware/rateLimit");
const router = express.Router();

router.post("/triage", triageLimiter, triage);

module.exports = router;
