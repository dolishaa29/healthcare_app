let mongo=require("mongoose");
let app=mongo.Schema({
email:{type:String},
name:{type:String},
userid:{type:String},
doctorid:{type:String},
doctormail:{type:String},
description:{type:String},
date:{type:String},
time:{type:String},
});
module.exports=mongo.model('appointmentnew',app);