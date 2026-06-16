let express = require("express");
let userAuth = require("../middleware/user");
let upload = require("../middleware/multer");
const { handleReport, getReports } = require("../service/reportanalysis");

let router = express.Router();

router.post("/report", userAuth, upload.single("file"), handleReport);
router.get("/report", userAuth,getReports);

module.exports = router;
