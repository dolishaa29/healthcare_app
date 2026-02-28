const { adminregister, adminlogin, adminprofile, adminlogout} = require("../service/adminservice");

exports.adminregister=async(req,res)=>
{
 await adminregister(req,res);
}
exports.adminlogin = async (req, res) =>
{
    await adminlogin(req, res);
}
exports.adminprofile=async(req,res)=>
{
 await adminprofile(req,res);
}
exports.adminlogout=async(req,res)=>
{
  await adminlogout(req,res);
}
