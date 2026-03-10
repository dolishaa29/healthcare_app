const { appointrequest, viewappointment, appointmentstatus } = require("../service/appointment");

exports.appointrequest=async(req,res)=>
{
    await appointrequest(req,res);
}

exports.viewappointment=async(req,res)=>
{
    await viewappointment(req,res);
}

exports.appointmentstatus=async(req,res)=>
{
    await appointmentstatus(req,res);
}

