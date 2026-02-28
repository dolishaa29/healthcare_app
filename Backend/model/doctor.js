let mongo=require("mongoose");
let doctormodel=mongo.Schema({
   email:{type:String},
   password:{type:String},
   name:{type:String},
   specialization:{type:String},
   contact:{type:Number},
   address:{type:String},

});
module.exports=mongo.model('doctor',doctormodel);