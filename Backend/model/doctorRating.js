let mongo=require("mongoose");
let rating=mongo.Schema({
    doctorId:{type:String },
    userId:{type:mongoose.Schema.Types.ObjectId,
        ref:"doctor"
    },
    rating:{type:Number },
    description:{type:String},
    date:{type:Date, default:Date.now}
}
)
module.exports=mongo.model('ratings',rating);