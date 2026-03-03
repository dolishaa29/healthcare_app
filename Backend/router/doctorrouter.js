let express=require("express");
let auth=require("../middleware/admin");
let auths=require("../middleware/doctor");
let router=express.Router();
const { doctorregister , doctorlogin,doctorlogout,doctorprofile, doctorlist, doctorpermission, doctorrequest, doctorpermissionupdate} = require("../controller/doctorcontroller");
const doctor = require("../model/doctor");

router.post("/doctorregister",doctorregister);
router.post("/doctorlogin",doctorlogin);
router.get('/doctorprofile', auths, doctorprofile);
router.get("/doctorlogout",auths,doctorlogout);
router.get("/viewdoctors",doctorlist);
router.post("/doctorpermission",doctorpermission);
router.get("/doctorrequest",doctorrequest);
router.put("/doctorpermissionupdate",doctorpermissionupdate);



module.exports=router;