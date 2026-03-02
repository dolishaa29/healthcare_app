const { userregister,userlogin,userlogout,userprofile,userlist} = require("../service/userservice");

exports.userregister=async(req,res)=>
{
 await userregister(req,res);
}
exports.userlogin = async (req, res) =>
{
    await userlogin(req, res);
}
exports.userprofile=async(req,res)=>
{
 await userprofile(req,res);
}
exports.userlogout=async(req,res)=>
{
  await userlogout(req,res);
}
exports.userlist=async(req,res)=>
{
  await userlist(req,res);
}