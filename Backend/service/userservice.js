let rec=require("../model/user");
let rec2=require("../model/Appointment/appointment");
let otps=require("../model/OTP");
let bcrypt=require("bcrypt");
let jwt=require("jsonwebtoken");
let crypto=require("crypto");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS_KEY
  },

});
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
    if(data.userstatus==="block")
    {
        return res.status(403).json({ 
            success: false, 
            msg: 'Your account is blocked by the admin. Login failed.' 
        });
    }
    lpass=data.password;
    let pass=await bcrypt.compare(password,lpass);
    if(pass)
    {
    let token=jwt.sign({token:data.email},process.env.JWT_SECRET,{expiresIn:"1h"});
    
    res.cookie("token",token ,{
        httpOnly: true,
        secure: true,
        sameSite: "none",
        
    });
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

exports.userDashboard=async(req,res)=>
{
    const user =  req.user;
    return res.status(200).json({success: true,msg: "user dashboard fetched successfully",dashboard:
    {
     email:user.email,name:user.name,contact:user.contact,address:user.address,id:user._id
    },
    });
}

exports.userviewapp=async(req,res)=>{
    const user = req.user;
    console.log("User ID from request:", user._id);
    let appointments = await rec2.find({ userid: user._id });
    console.log("Appointments for user:", appointments);
    return res.status(200).json({ success: true, appointments });
};
    

exports.otpgenerate=async(req,res)=>
{
    try
    {
    let email=req.body.email;
    let role=req.body.role;
    let user=await rec.findOne({email:email});
    if(!user)
    {
        return res.status(400).json({msg:"no user with that email found"});

    }
    let otp=crypto.randomInt(100000,1000000).toString();
    let existingotp=await otps.findOne({email:email,role:role});
    if(existingotp)
    {
        existingotp.otp=otp;
        existingotp.createdAt=Date.now();
        await existingotp.save();
    }
    else{
        let newotp=new otps({email:email,role:role,otp:otp});
        await newotp.save();
    }
    const mail = {
        from: process.env.EMAIL,
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`
    };

    await transporter.sendMail(mail);
    return res.status(200).json({ success: true, msg: "OTP sent to email" });  
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({msg:"internal server error"});
    }
}

exports.otpverify=async(req,res)=>
{
    try
    {
    let email=req.body.email;
    let otp=req.body.otp;
    let role=req.body.role;
    let record=await otps.findOne({email:email,otp:otp,role:role});
    if(!record)
    {
        return res.status(400).json({success: false,msg:"invalid OTP"});

    }
        let password=crypto.randomBytes(8).toString("hex");
        let hp=await bcrypt.hash(password,10);
        await rec.findOneAndUpdate({email:email},{password:hp});
        const mail = {
            from: process.env.EMAIL,
            to: email,
            subject: "Password Reset Successful",
            text: `Your password has been reset successfully. Your new password is: ${password}`
        };
        await transporter.sendMail(mail);

        await otps.deleteOne({email:email,otp:otp,role:role});
        return res.status(200).json({success: true,msg:"OTP verified successfully"});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({msg:"internal server error"});
    }

}

exports.blockuser = async (req, res) => {
    try {
        
        const id = req.body.id;
        console.log("user "+id);
        const user = await rec.findById(id);

        const newStatus = user.userstatus === "block" ? "unblock" : "block";
        user.userstatus = newStatus;
        console.log(newStatus);
        await user.save();
       
        return res.status(200).json({
            success: true,
            msg: `User has been ${newStatus} successfully`,
            data: user
        });

    } catch (err) {
        console.log("hi")
        console.error("Error toggling doctor status:", err);
        res.status(500).json({
            success: false,
            msg: "Internal server error"
        });
    }
};

exports.userbyid=async(req,res)=>
{
try{
    let id=req.params.id;
    console.log(id);
    let data=await rec.findById(id);
    return res.status(200).json({
        success:true,
        user:data
    });
}
catch(err)
{
    console.log(err);
    res.status(500).json({status:false , msg:"internal server error"});
}
}

