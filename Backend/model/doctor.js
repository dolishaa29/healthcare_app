let mongo=require("mongoose");
let doctormodel=mongo.Schema({
   email:{type:String},
   password:{type:String},
   name:{type:String},
   specialization:{type:String},
   contact:{type:Number},
   address:{type:String},
   gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: null,
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    age: {
      type: Number,
      default: 0,
    },

    degrees: {
        title: { type: String, default: null },
        institution: { type: String, default: null },
        year: { type: Number, default: 0 },
  },

    experienceYears: {
      type: Number,
      default: 0,
    },

    hospitalName: {
      type: String,
      default: null,
    },
    clinicAddress: {
      type: String,
      default: null,
    },

    bio: {
      type: String,
      default: null,
    },

    image: {
      type: String,
      default: null,
    },
  

});
module.exports=mongo.model('doctor',doctormodel);