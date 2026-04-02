let express=require("express");
let auth=require("../middleware/admin");
let auths=require("../middleware/doctor");
let router=express.Router();
const { doctorregister , doctorlogin,doctorlogout,doctorprofile, doctorlist, doctorpermission, doctorrequest, doctorpermissionupdate, doctorDashboard, doctorviewapp, doctorupdate, changePassword} = require("../controller/doctorcontroller");


router.post("/doctorregister",doctorregister);
router.post("/doctorlogin",doctorlogin);
router.get('/doctorprofile', auths, doctorprofile);
router.get("/doctorlogout",auths,doctorlogout);
router.get("/viewdoctors",doctorlist);
router.post("/doctorpermission",doctorpermission);
router.get("/doctorrequest",doctorrequest);
router.put("/doctorpermissionupdate",doctorpermissionupdate);
router.get("/doctordashboard",auths,doctorDashboard);
router.get("/doctorviewapp",auths,doctorviewapp);
router.put("/updatedoctor",auths,doctorupdate);
router.put("/changepassword",auths,changePassword);



module.exports=router;