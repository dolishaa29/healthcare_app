let express=require("express");
let auth=require("../middleware/user");
let router=express.Router();
const upload = require("../middleware/multer");

const { userregister, userlogin ,userprofile,userlogout, userlist, userDashboard, userviewapp, otpgenerate: userotpgenerate, otpverify: userotpverify, userbyid, changepassword, registerotpverify: userregisterverify } = require("../service/userservice");
const { blockuser, updateuser } = require("../service/userservice");

router.post("/userregister",userregister);
router.post("/userlogin",userlogin);
router.get('/userprofile', auth, userprofile);
router.get("/userlogout",auth,userlogout);
router.get("/viewusers",userlist);
router.get("/userdashboard",auth,userDashboard);
router.get("/userviewapp",auth,userviewapp);
router.post("/userregisterverify",userregisterverify);
router.post("/userforgotpassword",userotpgenerate);
router.post("/userverifyotp",userotpverify);
router.post("/blockuser",blockuser);
router.get("/userbyid/:id",userbyid);
router.put("/changepassworduser",auth,changepassword);
router.put("/updateuser",auth,upload.single('image'),updateuser);

module.exports=router;