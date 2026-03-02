let rec=require("../model/doctor");
let jwt=require("jsonwebtoken");
let bct=require("bcryptjs");


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
    let existing=await rec.findOne({email:email});
    if(existing)
    {
        res.json({message:"email already registered"});
    }
    else{
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