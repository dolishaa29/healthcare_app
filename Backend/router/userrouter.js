let express=require("express");
let auth=require("../middleware/user");
let router=express.Router();

const { userregister, userlogin ,userprofile,userlogout, userlist, userDashboard, userviewapp, userotpgenerate, userotpverify, userbyid, changepassword } = require("../controller/usercontroller");
const { blockuser } = require("../service/userservice");

router.post("/userregister",userregister);
router.post("/userlogin",userlogin);
router.get('/userprofile', auth, userprofile);
router.get("/userlogout",auth,userlogout);
router.get("/viewusers",userlist);
router.get("/userdashboard",auth,userDashboard);
router.get("/userviewapp",auth,userviewapp);
router.post("/userforgotpassword",userotpgenerate);
router.post("/userverifyotp",userotpverify);
router.post("/blockuser",blockuser);
router.get("/userbyid/:id",userbyid);
router.post("/changepassworduser",changepassword);

module.exports=router;