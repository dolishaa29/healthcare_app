let express=require("express");
let auth=require("../middleware/admin");
let auths=require("../middleware/doctor");
let router=express.Router();
const { doctorregister , doctorlogin,doctorlogout,doctorprofile, doctorlist, doctorpermission, doctorrequest, doctorpermissionupdate, doctorDashboard, doctorviewapp, doctorupdate, changePassword, doctorprofileview} = require("../controller/doctorcontroller");

const multer = require("multer");
let upload =multer({ 
    storage:multer.diskStorage({
        destination:(req, file, cb)=>{
            cb(null,"./public/images");
        },
        filename:(req,file,cb)=>{
            cb(null, file.originalname);
        }
    })
})

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
router.put("/updatedoctor",auths,upload.single("image"),doctorupdate);
router.put("/changepassword",auths,changePassword);
router.get("/doctorprofileview/:id",doctorprofileview);



module.exports=router;