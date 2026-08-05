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
// userviewapp/getUserConversations filter by userid alone, which isn't
// covered by the compound index above (doctorid is its leftmost field).
app.index({ userid: 1 });
module.exports=mongo.model('appointmentnew',app);