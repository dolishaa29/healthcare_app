let mongo=require("mongoose");
let rating=mongo.Schema({
    doctormail:{type:String , required},
    usermail:{type:String , required},
    rating:{type:Number , required},
    description:{type:String},
    date:{type:Date, default:Date.now}
}
)
module.exports=mongo.model('ratings',rating);