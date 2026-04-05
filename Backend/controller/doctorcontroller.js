const { doctorlogin,doctorprofile,doctorregister,doctorlogout,doctorlist, doctorpermission, doctorpermissionupdate, doctorrequest, doctorDashboard, doctorviewapp, changePassword, doctorupdate, doctorprofileview} = require("../service/doctorservice");

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

exports.doctorDashboard=async(req,res)=>
{
  await doctorDashboard(req,res);
}

exports.doctorviewapp=async(req,res)=>
{
  await doctorviewapp(req,res);
}
exports.doctorupdate=async(req,res)=>
{
  await doctorupdate(req,res);
}
exports.changePassword=async(req,res)=>
{
  await changePassword(req,res);
}

exports.doctorprofileview=async(req,res)=>
{
  await doctorprofileview(req,res);
}