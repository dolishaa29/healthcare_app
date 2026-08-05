let mongo=require("mongoose");
let otpmodel=mongo.Schema({
   email:{type:String},
   role:{type:String},
   otp:{type:Number},
   createdAt:{type:Date,default:Date.now,expires:600}
});
// The app's real key is (email, role) — see otpgenerate()/otpverify() in
// userservice.js/doctorservice.js, which always query/upsert by both. A
// unique constraint on email alone would block the same email from ever
// having, say, both a user-role and doctor-role OTP outstanding at once.
otpmodel.index({ email: 1, role: 1 }, { unique: true });
module.exports=mongo.model('otps',otpmodel);
