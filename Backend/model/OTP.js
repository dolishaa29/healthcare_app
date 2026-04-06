let mongo=require("moongose");
let otpmodel=mongo.Schema({
   email:{type:String , unique:true},
   role:{type:String},
   otp:{type:Number},
   createdAt:{type:Date,default:Date.now,expires:600} 
});
module.exports=mongo.model('otps',otpmodel);
