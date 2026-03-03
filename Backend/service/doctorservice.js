let rec=require("../model/doctor");
let rec2=require("../model/permission");
let jwt=require("jsonwebtoken");
let bct=require("bcryptjs");
const permission = require("../model/permission");

exports.doctorpermission=async(req,res)=>
{   
    console.log("Doctor permission request body:", req.body);
    let email=req.body.email;
    let password=req.body.password;
    let contact=req.body.contact;
    let name=req.body.name;
    let specialization=req.body.specialization;
    let address=req.body.address;
    let hp=await bct.hash(password,10);
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
            password:hp,
            contact:contact,
            name:name,
            specialization:specialization,
            address:address
        });
        await newdoctor.save();
        return res.status(201).json({success: true,msg:'doctor registered , approval pending'})
    }
}


exports.doctorregister=async(req,res)=>
{   
    console.log("Doctor registration request body:", req.body);
    let email=req.body.email;
    let password=req.body.password;
    let contact=req.body.contact;
    let name=req.body.name;
    let specialization=req.body.specialization;
    let address=req.body.address;
    let hp=await bct.hash(password,10);
  
        let newdoctor=new rec({
            email:email,
            password:hp,
            contact:contact,
            name:name,
            specialization:specialization,
            address:address
        });
        await newdoctor.save();
        res.json({message:"doctor registered successfully"});

}

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
    let token=jwt.sign({token:data.email},"aabb",{
        expiresIn:"1d"
    });
    res.cookie('emstoken', token);
    return res.status(200).json({success: true,msg:'doctor login successfully',token})
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
    return res.status(200).json({success: true,doctor})
}

exports.doctorlist=async(req,res)=>
{
    let doctors=await rec.find();
    return res.status(200).json({success: true,doctors})
}

exports.doctorrequest=async(req,res)=>
{
    let doctors=await rec2.find();
    return res.status(200).json({success: true,doctors});
}

exports.doctorpermissionupdate=async(req,res)=>
{
    id=req.body._id;
    let permission=req.body.permission;
    let updated=await rec2.findByIdAndUpdate(id,{permission:permission});
    return res.status(200).json({success:true,msg:"permission updated successfully",updated});
}