const { userregister,userlogin,userlogout,userprofile,userlist, userDashboard, userviewapp, otpgenerate, otpverify} = require("../service/userservice");

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
exports.userDashboard=async(req,res)=>
{
  await userDashboard(req,res); 
}
exports.userviewapp=async(req,res)=>
{
    await userviewapp(req,res);
}

exports.userotpgenerate=async(req,res)=>
{
  await otpgenerate(req,res);
}

exports.userotpverify=async(req,res)=>
{
  await otpverify(req,res);
}