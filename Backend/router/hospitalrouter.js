const express = require("express");
const { nearbyHospitals } = require("../service/hospitalservice");
const { hospitalLimiter } = require("../middleware/rateLimit");
const router = express.Router();

router.get("/nearby-hospitals", hospitalLimiter, nearbyHospitals);

module.exports = router;
