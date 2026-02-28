let mongo=require("mongoose");
let adminmodel=mongo.Schema({
   email:{type:String},
   password:{type:String},
   contact:{type:Number},

});
module.exports=mongo.model('admin',adminmodel);