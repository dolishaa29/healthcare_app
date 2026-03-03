const { doctorlogin,doctorprofile,doctorregister,doctorlogout,doctorlist, doctorpermission, doctorpermissionupdate, doctorrequest} = require("../service/doctorservice");

exports.doctorregister=async(req,res)=>
{
 await doctorregister(req,res);
}
exports.doctorlogin = async (req, res) =>
{
    await doctorlogin(req, res);
}
exports.doctorprofile=async(req,res)=>
{
 await doctorprofile(req,res);
}
exports.doctorlogout=async(req,res)=>
{
  await doctorlogout(req,res);
}
exports.doctorlist=async(req,res)=>
{
  await doctorlist(req,res);
}

exports.doctorpermission=async(req,res)=>
{
  await doctorpermission(req,res);
}

exports.doctorrequest=async(req,res)=>
{
  await doctorrequest(req,res);
}

exports.doctorpermissionupdate=async(req,res)=>
{
  await doctorpermissionupdate(req,res);
}