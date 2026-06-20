const { userregister,userlogin,userlogout,userprofile,userlist, userDashboard, userviewapp, otpgenerate, otpverify, blockuser, userbyid, changepassword, updateuser, registerotpverify} = require("../service/userservice");

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

exports.blockuser=async(req,res)=>
{
  await blockuser(req,res);
}

exports.userbyid=async(req,res)=>
{
  await userbyid(req,res);
}

exports.changepassword=async(req,res)=>
{
  await changepassword(req,res);
}

exports.updateuser=async(req,res)=>
{
  await updateuser(req,res);
}

exports.userregisterverify=async(req,res)=>
{
  await registerotpverify(req,res);
}