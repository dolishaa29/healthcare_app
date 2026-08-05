let rec=require("../model/user");
let rec2=require("../model/Appointment/appointment");
let otps=require("../model/OTP");
let pendingUsers=require("../model/PendingUser");
let bcrypt=require("bcrypt");
let jwt=require("jsonwebtoken");
let crypto=require("crypto");
const nodemailer = require("nodemailer");
const cloudinary=require("../config/cloudinary");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS_KEY
  },

});
exports.userregister=async(req,res)=>
{
    try{
    let email=req.body.email;
    let password=req.body.password;
    let name=req.body.name;
    let contact=req.body.contact;
    let address=req.body.address;
    let user=await rec.findOne({email:email});
    if(user)
    {
        return res.status(400).json({msg:"user already exists"});
    }
    let hash=await bcrypt.hash(password,10);
    let otp=crypto.randomInt(100000,1000000).toString();

    await pendingUsers.findOneAndUpdate(
        {email:email},
        {email,name,password:hash,contact,address,otp,createdAt:Date.now()},
        {upsert:true,new:true}
    );

    const mail = {
        from: process.env.EMAIL,
        to: email,
        subject: "Email Verification OTP",
        text: `Your OTP to complete registration is: ${otp}. It is valid for 10 minutes.`
    };
    await transporter.sendMail(mail);

    return res.status(200).json({success:true, msg:"OTP sent to your email. Please verify to complete registration."});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({msg:"internal server error"});
    }
}

exports.registerotpverify=async(req,res)=>
{
    try{
    let email=req.body.email;
    let otp=req.body.otp;
    let pending=await pendingUsers.findOne({email:email,otp:otp});
    if(!pending)
    {
        return res.status(400).json({success:false, msg:"Invalid or expired OTP"});
    }
    let newuser=new rec({
        email:pending.email,
        password:pending.password,
        name:pending.name,
        contact:pending.contact,
        address:pending.address
    });
    await newuser.save();
    await pendingUsers.deleteOne({email:email});
    return res.status(200).json({success:true, msg:"Registration successful. You can now login."});
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
        return res.status(400).json({msg:"user not found"});
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
    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit, 10);

    // page/limit are opt-in — omit them to get the old unpaginated behavior.
    if (!page || !limit) {
        let users=await rec.find();
        return res.status(200).json({users:users});
    }

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
        rec.find().skip(skip).limit(limit),
        rec.countDocuments(),
    ]);
    res.status(200).json({ users, total, page, totalPages: Math.ceil(total / limit) });
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

exports.changepassword=async(req,res)=>
{
    try{
    const user=req.user;
    let oldpassword=req.body.oldpassword;
    let newpassword=req.body.newpassword;
    let data=await rec.findById(user._id);
    let existing=data.password;
    let pass=await bcrypt.compare(oldpassword,existing);
    if(!pass)
    {
        return res.status(400).json({msg:"invalid old password"});
    }
    newpassword=await bcrypt.hash(newpassword,10);
    await rec.findByIdAndUpdate(user._id,{password:newpassword});
    return res.status(200).json({success:true, msg:"password updated successfully"});
}
catch(err)
{
    console.log(err);
    res.status(500).json({msg:"internal server error"});
}

}

exports.updateuser=async(req,res)=>
{
    try {
        const user=req.user;
        let image=user.image;

        if (req.file) {
            try {
                const result = await cloudinary.uploadBuffer(req.file.buffer, {
                    folder: "user-images",
                });
                if (result && result.secure_url) {
                    image = result.secure_url;
                }
            } catch (uploadErr) {
                console.log("Cloudinary upload error:", uploadErr);
            }
        }

        let updatedData={
            email:req.body.email,
            name:req.body.name,
            contact:req.body.contact,
            address:req.body.address,
            gender:req.body.gender,
            dob:req.body.dob,
            fatherName:req.body.fatherName,
            motherName:req.body.motherName,
            maritalStatus:req.body.maritalStatus,
            nationality:req.body.nationality,
            bloodGroup:req.body.bloodGroup,
            emergencyContactName:req.body.emergencyContactName,
            emergencyContactNumber:req.body.emergencyContactNumber,
            emergencyRelation:req.body.emergencyRelation,
            image:image,
        }
        let updateduser= await rec.findOneAndUpdate({_id:user._id},updatedData,{new:true});
        return res.status(200).json({ success: true, msg: "User profile updated successfully", user:updateduser });
    } catch (error) {
        console.error("Error in updateuser:", error);
        return res.status(500).json({ success: false, msg: "Internal server error" });
    }
}