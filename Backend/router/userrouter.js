let express=require("express");
let auth=require("../middleware/user");
let router=express.Router();
const { userregister, userlogin ,userprofile,userlogout, userlist } = require("../controller/usercontroller");
router.post("/userregister",userregister);
router.post("/userlogin",userlogin);
router.get('/userprofile', auth, userprofile);
router.get("/userlogout",auth,userlogout);
router.get("/viewusers",userlist);

module.exports=router;