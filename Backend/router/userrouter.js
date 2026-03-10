let express=require("express");
let auth=require("../middleware/user");
let router=express.Router();

const { userregister, userlogin ,userprofile,userlogout, userlist, userDashboard, userviewapp } = require("../controller/usercontroller");

router.post("/userregister",userregister);
router.post("/userlogin",userlogin);
router.get('/userprofile', auth, userprofile);
router.get("/userlogout",auth,userlogout);
router.get("/viewusers",userlist);
router.get("/userdashboard",auth,userDashboard);
router.get("/userviewapp",auth,userviewapp);

module.exports=router;