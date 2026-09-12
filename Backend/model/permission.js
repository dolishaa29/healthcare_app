let mongo=require("mongoose");
let doctormodel=mongo.Schema({
   email:{type:String},
   password:{type:String},
   name:{type:String},
   specialization:{type:String},
   contact:{type:Number},
   address:{type:String},
   certificate:{type:String},
   permission:{type:String,default:"pending",enum:["pending","approved","rejected"]},

});
doctormodel.index(
   { email: 1 },
   { unique: true, partialFilterExpression: { permission: { $in: ["pending", "approved"] } } }
);
module.exports=mongo.model('doctorpermissions',doctormodel);