const express = require("express");
const { analyzeSkin } = require("../service/skinanalysis");
const userAuth = require("../middleware/user");
const { skinAnalysisLimiter } = require("../middleware/rateLimit");
const router = express.Router();
router.post("/skin-analysis", userAuth, skinAnalysisLimiter, analyzeSkin);

module.exports = router;
