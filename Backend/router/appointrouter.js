let express=require("express");
let auth=require("../middleware/admin");
let auths=require("../middleware/user");
const { appointrequest } = require("../controller/appointmentcontroller");
let router=express.Router();


router.post("/appointrequest",auths ,appointrequest);

module.exports=router;