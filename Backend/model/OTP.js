let mongo=require("mongoose");
let otpmodel=mongo.Schema({
   email:{type:String},
   role:{type:String},
   otp:{type:Number},
   createdAt:{type:Date,default:Date.now,expires:600}
});
otpmodel.index({ email: 1, role: 1 }, { unique: true });
module.exports=mongo.model('otps',otpmodel);
