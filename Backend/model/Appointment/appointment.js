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
app.index({ doctorid: 1, date: 1, time: 1 }, { unique: true });
app.index({ userid: 1 });
module.exports=mongo.model('appointmentnew',app);