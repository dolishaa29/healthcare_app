let express = require("express");
const { getrating, viewrating } = require("../controller/ratingcontroller");
let router=express.Router();
let auth=require('../middleware/user')

router.post('/getrating',auth,getrating);
router.get('/viewrating',viewrating);

module.exports=router;