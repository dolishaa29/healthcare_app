const { doctorlogin,doctorprofile,doctorregister,doctorlogout,doctorlist} = require("../service/doctorservice");

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