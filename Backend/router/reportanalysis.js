let express = require("express");
let userAuth = require("../middleware/user");
let upload = require("../middleware/multer");
const { handleReport, getReports, getTrends, deleteReport } = require("../service/reportanalysis");

let router = express.Router();

router.post("/report", userAuth, upload.single("file"), handleReport);
router.get("/report", userAuth,getReports);
router.get("/report/trends", userAuth, getTrends);
router.delete("/report/:id", userAuth, deleteReport);

module.exports = router;
