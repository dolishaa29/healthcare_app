let express=require("express");
let auth=require("../middleware/admin");
let auths=require("../middleware/user");
const { appointrequest, viewappointment, appointmentstatus, approveappointment } = require("../controller/appointmentcontroller");
let router=express.Router();


router.post("/appointrequest",auths ,appointrequest);
router.get("/viewappointment",auth, viewappointment);
router.put("/appointmentstatus",appointmentstatus);
router.post("/approveappointment",approveappointment);
module.exports=router;
