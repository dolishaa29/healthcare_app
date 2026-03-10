let rec4=require("../model/Appointment/appointrequest");

exports.appointrequest=async(req,res)=>
{
 console.log("Appointment request received");   
 let user=req.user;
 let doctorid=req.body.doctorid;
 let doctormail=req.body.doctormail;
 let description=req.body.description;

 let appointment=new rec4({
    userid:user._id,
    name:user.name,
    email:user.email,
    doctorid:doctorid,
    doctormail:doctormail,
    description:description,
 });

 await appointment.save();
    return res.status(201).json({success: true,msg:'appointment request sent successfully'});
}

exports.viewappointment=async(req,res)=>
{   
    const admin = req.admin;
    if (!admin) {
        return res.status(403).json({success: false,msg:'Access denied. Admin privileges required.'});
    }
    let appointments=await rec4.find();
    return res.status(200).json({success: true,msg:'appointment requests fetched successfully',appointments});
}

exports.appointmentstatus=async(req,res)=>
{   
    let id=req.body.id;
    let status=req.body.status;
    let appointment=await rec4.findByIdAndUpdate({_id:id},{status:status});
    if(appointment)
    {
        return res.status(200).json({success: true,msg:'appointment status updated successfully'});
    }
    else
    {
        return res.status(404).json({success: false,msg:'appointment not found'});
    }
}

exports.approveappointment=async(req,res)=>
{
    
    
}