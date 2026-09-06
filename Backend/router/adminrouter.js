let express=require("express");
let auth=require("../middleware/admin")
let router=express.Router();
const { adminregister, adminlogin, adminprofile, adminlogout, adminDashboard} = require("../service/adminservice");
router.post("/adminregister",adminregister);
router.post("/adminlogin",adminlogin);
router.get('/adminprofile',auth, adminprofile);
router.get("/adminlogout",auth,adminlogout);
router.get("/admindashboard",auth,adminDashboard);

module.exports=router;