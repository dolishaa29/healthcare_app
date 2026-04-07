let rec=require("../model/doctor");
let rec2=require("../model/permission");
let app=require("../model/Appointment/appointment");
let jwt=require("jsonwebtoken");
let otps=require("../model/OTP");
let bct=require("bcryptjs");
let crypto=require("crypto");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  debug: true, 
  logger: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS_KEY
  }
});


exports.doctorpermission=async(req,res)=>
{   
    console.log("Doctor permission request body:", req.body);
    let email=req.body.email;
    let contact=req.body.contact;
    let name=req.body.name;
    let specialization=req.body.specialization;
    let address=req.body.address;
    let certificate=req.file.filename;
    let already = await rec2.findOne({ email: email });

if (already && (already.permission === "pending" || already.permission === "approved")) {
    return res.status(400).json({
        success: false,
        msg: "Doctor already exists with pending or approved permission"
    });
}
    else{
        let newdoctor=new rec2({
            email:email,
            contact:contact,
            name:name,
            specialization:specialization,
            address:address,
            certificate:certificate,

        });
        await newdoctor.save();
        return res.status(201).json({success: true,msg:'doctor registered , approval pending'})
    }
}

exports.doctorregister = async (req, res) => {
  try {

    console.log("Doctor registration request body:", req.body);

    let email = req.body.email;
    let contact = req.body.contact;
    let name = req.body.name;
    let specialization = req.body.specialization;
    let address = req.body.address;
    let password = crypto.randomBytes(4).toString("hex");

    let hp = await bct.hash(password, 10);

    let newdoctor = new rec({
      email: email,
      password: hp,
      contact: contact,
      name: name,
      specialization: specialization,
      address: address,

    });

    await newdoctor.save();

    const mail = {
      from: process.env.EMAIL,
      to: email,
      subject: "Registration Successful",
      text: `Hello Dr. ${name}, your account has been successfully registered and approved.
      Your login credentials are as follows:
      Email: ${email}
      Password: ${password}`
    };

    await transporter.sendMail(mail);

    res.json({ message: "doctor registered successfully and email sent" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error in registration" });
  }
};

exports.doctorlogin=async(req,res)=>
{
 let email=req.body.email;
 let password=req.body.password;

 let data=await rec.findOne({email:email});
 if(!data)
 {
    return res.status(404).json({success: false,msg:'doctor not found'})
 }
 let lpass=data.password;
 let pass=await bct.compare(password,lpass);

 if(pass)
 {
    let token=jwt.sign({token:data.email},process.env.JWT_SECRET,{
        expiresIn:"1d"
    });
    res.cookie('emstoken', token , {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    return res.status(200).json({success: true,msg:'doctor login successfully',token});
 }
 else
 {
    return res.status(400).json({success: false,msg:'doctor login failed'})
 }
};

exports.doctorlogout=async(req,res)=>
{
    res.clearCookie("emstoken");
    return res.status(200).json({success: true,msg:'doctor logout successfully'})
}

exports.doctorprofile=async(req,res)=>
{
    const doctor = req.doctor;
    let doctorData = await rec.findById(doctor._id);
    if (!doctorData) {
        return res.status(404).json({ success: false, msg: "Doctor not found" });
    }

    return res.status(200).json({success: true,doctors:doctorData});
}

exports.doctorlist=async(req,res)=>
{
    let doctors=await rec.find();
    return res.status(200).json({success: true,doctors})
}

exports.doctorrequest=async(req,res)=>
{  
    console.log("Fetching doctor requests");
    let doctors=await rec2.find();
    return res.status(200).json({success: true,doctors});
}

exports.doctorpermissionupdate=async(req,res)=>
{
    id=req.body.id;
    let permission=req.body.permission;
    let updated=await rec2.findByIdAndUpdate(id,{permission:permission});
    return res.status(200).json({success:true,msg:"permission updated successfully",updated});
}

exports.doctorDashboard=async(req,res)=>
{
    const doctor =  req.doctor;
    return res.status(200).json({success: true,msg: "doctor dashboard fetched successfully",dashboard:
    {
     email:doctor.email,name:doctor.name,contact:doctor.contact,address:doctor.address,id:doctor._id
    },
    });
}

exports.doctorviewapp=async(req,res)=>{
    const doctor = req.doctor;
    console.log("Doctor ID from request:", doctor._id);
    let appointments = await app.find({ doctorid: doctor._id });
    
    console.log("Appointments for doctor:", appointments);
    return res.status(200).json({ success: true, appointments });
}

exports.doctorupdate=async(req,res)=>
{
    const doctor = req.doctor;
    let image = req.file ? req.file.path : null;
    let updateData = {
        name: req.body.name,
        specialization: req.body.specialization,
        contact: req.body.contact,
        address: req.body.address,
        hospitalName: req.body.hospitalName,
        HospitalAddress: req.body.HospitalAddress,
        bio: req.body.bio,
        experienceYears: req.body.experienceYears,
        title: req.body.title,
        institution: req.body.institution,
        year: req.body.year,
        image: image,
    };
    let updatedDoctor = await rec.findOneAndUpdate({ _id: doctor._id }, updateData, { new: true });
    return res.status(200).json({ success: true, msg: "doctor profile updated successfully", doctor: updatedDoctor });
}

exports.changePassword=async(req,res)=>
{
try{
    const doctor = req.doctor;
    let oldpassword=req.body.oldpassword;
    let newpassword=req.body.newpassword;
    let data=await rec.findById(doctor._id);
    let existpass=data.password;
    let pass=await bct.compare(oldpassword,existpass);
    if(!pass)    {
        return res.status(400).json({msg:"invalid old password"});
    }
    newpassword=await bct.hash(newpassword,10);
    await rec.findByIdAndUpdate(doctor._id,{password:newpassword});
    return res.status(200).json({msg:"password changed successfully"});
}
catch(err)
{
    console.log(err);
    res.status(500).json({msg:"internal server error"});
}
}

exports.doctorprofileview=async(req,res)=>
{
    id=req.params.id;
    console.log("Doctor profile view request for ID:", id);
    let doctor=await rec.findById({_id: id});
    if(!doctor)    {
        return res.status(404).json({success: false,msg:'doctor not found'})
    }
    return res.status(200).json({success: true,doctor:doctor});
}

exports.otpgenerate=async(req,res)=>{
    try{
    let email=req.body.email;
    let role=req.body.role;
    console.log("OTP generation request for email:", email, "and role:", role);
    let doctor=await rec.findOne({email:email});
    if(!doctor)    
    {
        return res.status(404).json({success: false,msg:'invalid doctor email'});
    }
    let otp=crypto.randomInt(100000, 1000000).toString();
    console.log("Generated OTP:", otp);
    let existingOtp = await otps.findOne({ email: email ,role: role});
    if (existingOtp) {
        existingOtp.otp = otp;
        existingOtp.createdAt = Date.now();
        await existingOtp.save();
    } else {
        let newOtp = new otps({ email: email, role: role, otp: otp });
        await newOtp.save();
    }

    const mail = {
        from: process.env.EMAIL,
        to: email,
        subject: "Password Reset OTP",
        text: `hi Dr. ${email}, Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`
    };

    await transporter.sendMail(mail);
    return res.status(200).json({ success: true, msg: "OTP sent to email" });  

    }
    catch(err){
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
        let password=crypto.randomBytes(4).toString("hex");
        let hp=await bct.hash(password,10);
        await rec.findOneAndUpdate({email:email},{password:hp});

        const mail = {
            from: process.env.EMAIL,
            to: email,
            subject: "New Password After OTP Verification",
            text: `hi Dr. ${email}, Your OTP has been verified successfully. Your new password is: ${password}. Please change it after logging in.`
        };
        await transporter.sendMail(mail);

        await otps.deleteOne({email:email,otp:otp,role:role});

        return res.status(200).json({success: true,msg:"OTP verified successfully and new password sent to email"});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({msg:"internal server error"});
    }
}    