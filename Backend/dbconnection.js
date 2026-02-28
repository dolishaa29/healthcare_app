let mongo=require("mongoose");
exports.health=()=>
{
mongo.connect("mongodb://localhost:27017/health")
console.log('successfully connected')
}