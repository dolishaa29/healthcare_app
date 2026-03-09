let express=require("express");
let auth=require("../middleware/admin");
let auths=require("../middleware/user");
const { appointrequest, viewappointment, appointmentstatus } = require("../controller/appointmentcontroller");
let router=express.Router();


router.post("/appointrequest",auths ,appointrequest);
router.get("/viewappointment",auth, viewappointment);
router.post("/appointmentstatus",appointmentstatus);
module.exports=router;