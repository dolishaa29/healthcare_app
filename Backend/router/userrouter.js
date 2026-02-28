let express=require("express");
let auth=require("../middleware/user");
let router=express.Router();
const { userregister, userlogin ,userprofile,userlogout } = require("../controller/usercontroller");
router.post("/userregister",userregister);
router.post("/userlogin",userlogin);
router.get('/userprofile', auth, userprofile);
router.get("/userlogout",auth,userlogout);

module.exports=router;