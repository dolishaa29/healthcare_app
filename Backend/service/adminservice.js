let rec=require("../model/admin");
let jwt=require("jsonwebtoken");
let bct=require("bcryptjs");

exports.adminregister=async(req,res)=>
{    
let email=req.body.email;
let password=req.body.password;
let contact=req.body.contact;
let hp=await bct.hash(password,10);
let data=await rec.find();
if(data.length==0){
let record=new rec({email:email,password:hp,contact:contact});
await record.save();
return res.status(201).json({success: true,msg:'admin registered successfully'}) 
}
else
{
return res.status(201).json({success: true,msg:'admin already registered'}) 
}
}  

exports.adminlogin=async(req,res)=>
{
let email=req.body.email;
let password=req.body.password;
let data=await rec.findOne({email:email});
console.log(data);
if(!data)
{
return res.status(404).json({success: false,msg:'admin not found'})
}
lpass=data.password;
console.log(lpass);
pass=await bct.compare(password,lpass); 
if(pass)
{
let token=jwt.sign({token:data.email},"aabb",{
expiresIn:"1d"
});
res.cookie('token', token);
console.log("send token"+token);
return res.status(200).json({success: true,msg:'admin login successfully',token})                                            
}
else
{
return res.status(400).json({success: false,msg:'admin login failed'})
}
}


exports.adminprofile=async(req,res)=>
{
const admin = req.admin;
return res.status(200).json({success: true,msg: "admin profile fetched successfully",profile:
{
 email:admin.email,contact:admin.contact,city:admin.city,organization:admin.organization,id:admin.id
},
});
}


exports.adminlogout=async(req,res)=>
{
const admin = req.admin;
res.clearCookie('emtoken', "");
return res.status(200).json({success:true});
}