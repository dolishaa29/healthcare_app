let mongo=require("mongoose");
let usermodel=mongo.Schema({
   email:{type:String},
   password:{type:String},
   name:{type:String},
   contact:{type:Number},
   address:{type:String},

});
module.exports=mongo.model('user',usermodel);