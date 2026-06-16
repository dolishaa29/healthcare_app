let express = require("express");
let userAuth = require("../middleware/user");
let upload = require("../middleware/multer");
const { handleReport, getReports } = require("../service/reportanalysis");

let router = express.Router();

router.post("/report", userAuth, upload.single("file"), async (req, res) => { await handleReport(req, res); });
router.get("/report", userAuth, async (req, res) => { await getReports(req, res); });

module.exports = router;
