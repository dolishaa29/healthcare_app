let mongo=require("mongoose");
let app=mongo.Schema({
email:{type:String},
name:{type:String},
userid:{type:String},
doctorid:{type:String},
doctormail:{type:String},
description:{type:String},
status:{type:String,default:"pending",enum:["pending","approved","rejected"]},
});
module.exports=mongo.model('appointmentrequest',app);