let express=require("express");
let auths=require("../middleware/doctor");
let router=express.Router();
const { doctorregister , doctorlogin,doctorlogout,doctorprofile, doctorlist, doctorpermission, doctorrequest, doctorpermissionupdate, doctorDashboard, doctorviewapp, doctorupdate, changePassword, doctorprofileview, doctorforgotpassword, doctorverifyotp, deletedoctor} = require("../controller/doctorcontroller");
const { blockdoctor } = require("../service/doctorservice");
const upload = require("../middleware/multer"); 
const cloudinary = require("../config/cloudinary");



router.post("/doctorregister",doctorregister);
router.post("/doctorlogin",doctorlogin);
router.get('/doctorprofile', auths, doctorprofile);
router.get("/doctorlogout",auths,doctorlogout);
router.get("/viewdoctors",doctorlist);
router.post("/doctorpermission",upload.single("certificate"),doctorpermission);
router.get("/doctorrequest",doctorrequest);
router.put("/doctorpermissionupdate",doctorpermissionupdate);
router.get("/doctordashboard",auths,doctorDashboard);
router.get("/doctorviewapp",auths,doctorviewapp);
router.put("/updatedoctor",auths,upload.single("image"),doctorupdate);
router.put("/changepassword",auths,changePassword);
router.get("/doctorprofileview/:id",doctorprofileview);
router.post("/doctorforgotpassword",doctorforgotpassword);
router.post("/doctorverifyotp",doctorverifyotp);
router.post('/deletedoctor',deletedoctor);
router.post('/blockdoctor',blockdoctor);

module.exports=router;