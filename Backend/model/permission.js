let mongo=require("mongoose");
let doctormodel=mongo.Schema({
   email:{type:String , unique:true},
   password:{type:String},
   name:{type:String},
   specialization:{type:String},
   contact:{type:Number},
   address:{type:String},
   permission:{type:String,default:"pending",enum:["pending","approved","rejected"]},

});
module.exports=mongo.model('doctorpermissions',doctormodel);