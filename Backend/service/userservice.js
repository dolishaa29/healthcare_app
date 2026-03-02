let rec=require("../model/user");
let bcrypt=require("bcrypt");
let jwt=require("jsonwebtoken");

exports.userregister=async(req,res)=>
{  
    console.log("userregister called with body:", req.body);
    try{
    let email=req.body.email;
    let password=req.body.password;
    let name=req.body.name;
    let contact=req.body.contact;
    let address=req.body.address;    
    let user=await rec.findOne({email:email});
    if(user)
    {        res.status(400).json({msg:"user already exists"});
    }
    else{
        let hash=await bcrypt.hash(password,10);
        let newuser=new rec({ email:email,password:hash,name:name,contact:contact,address:address});
        await newuser.save();
        res.status(200).json({msg:"user registered successfully"});
    }
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({msg:"internal server error"});
    }

}

exports.userlogin=async(req,res)=>
{
    try{
    let email=req.body.email;
    let password=req.body.password;
    let data=await rec.findOne({email:email});
    if(!data)
    {
        res.status(400).json({msg:"user not found"});
    }
    lpass=data.password;
    let pass=await bcrypt.compare(password,lpass);
    if(pass)
    {
    let token=jwt.sign({token:data.email},"aabb",{expiresIn:"1h"});
    
    res.cookie("token",token);
    console.log("token:",token);
    res.status(200).json({msg:"user logged in successfully",token:token});
    }
    else{
        res.status(400).json({msg:"invalid password"});
    }

}
catch(err)
{
    console.log(err);
    res.status(500).json({msg:"internal server error"});
}
}

exports.userprofile=async(req,res)=>
{
    const user = req.user;
    return res.status(200).json({success: true,user})
}

exports.userlist=async(req,res)=>
{
    try{
    let users=await rec.find();
    res.status(200).json({users:users});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({msg:"internal server error"});
    }
}