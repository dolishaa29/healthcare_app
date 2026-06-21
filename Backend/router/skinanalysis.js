const express = require("express");
const { analyzeSkin } = require("../service/skinanalysis");
const router = express.Router();
router.post("/skin-analysis", analyzeSkin);

module.exports = router;
