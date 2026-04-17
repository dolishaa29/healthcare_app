const { getrating, viewrating } = require("../service/ratings")

exports.getrating=async(req,res)=>
{
    await getrating(req,res);
}
exports.viewrating=async(req,res)=>
{
    await viewrating(req,res);
}