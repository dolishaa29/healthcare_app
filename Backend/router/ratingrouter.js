let express = require("express");
const { getrating, viewrating } = require("../service/ratings");
let router=express.Router();
let auth=require('../middleware/user')

router.post('/getrating',auth,getrating);
router.get('/viewrating/:doctorId',viewrating);

module.exports=router;