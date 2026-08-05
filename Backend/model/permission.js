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
// A doctor can be rejected and legitimately reapply (see doctorpermission()
// in service/doctorservice.js, which allows a new submission once the prior
// one is "rejected") — so email can't be globally unique. It only needs to
// stay unique while an application is actually pending/approved, which is
// the real invariant the service layer enforces; this backs it with an
// index so it's atomic even under concurrent submissions.
doctormodel.index(
   { email: 1 },
   { unique: true, partialFilterExpression: { permission: { $in: ["pending", "approved"] } } }
);
module.exports=mongo.model('doctorpermissions',doctormodel);