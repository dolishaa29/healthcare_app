let express=require("express");
let auth=require("../middleware/admin");
let auths=require("../middleware/doctor");
let router=express.Router();
const { doctorregister , doctorlogin,doctorlogout,doctorprofile} = require("../controller/doctorcontroller");
router.post("/doctorregister",doctorregister);
router.post("/doctorlogin",doctorlogin);
router.get('/doctorprofile', auths, doctorprofile);
router.get("/doctorlogout",auths,doctorlogout);

module.exports=router;