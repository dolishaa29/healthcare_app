let mongo=require("mongoose");
let usermodel=mongo.Schema({
   email:{type:String},
   password:{type:String},
   name:{type:String},
   contact:{type:Number},
   address:{type:String},
   doctorstatus:{type:String , default:"unblock" , enum:["block","unblock"]},

});
module.exports=mongo.model('user',usermodel);