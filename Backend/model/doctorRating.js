let mongo=require("mongoose");
let rating=mongo.Schema({
    doctorId:{type:String , required},
    userId:{type:String , required},
    rating:{type:Number , required},
    description:{type:String},
    date:{type:Date, default:Date.now}
}
)
module.exports=mongo.model('ratings',rating);