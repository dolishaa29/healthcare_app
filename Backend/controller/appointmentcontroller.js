const { appointrequest } = require("../service/appointment");

exports.appointrequest=async(req,res)=>
{
    await appointrequest(req,res);
}