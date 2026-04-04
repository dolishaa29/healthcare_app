let rec4=require("../model/Appointment/appointrequest");
let rec5=require("../model/Appointment/appointment");
let rec=require("../model/doctor");
exports.appointrequest=async(req,res)=>
{
 console.log("Appointment request received");   
 let user=req.user;
 let doctorid=req.body.doctorid;
 let description=req.body.description;
 let data=await rec.findOne({_id:doctorid});
 if(!data)
 {
    return res.status(404).json({success: false,msg:'Doctor not found'});
 }

 let appointment=new rec4({
    userid:user._id,
    name:user.name,
    email:user.email,
    doctorid:doctorid,
    doctormail:data.email,
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
      let appointment=req.body;
      let rec=new rec5({
        userid:appointment.userid,
        name:appointment.name,
        email:appointment.email,
        doctorid:appointment.doctorid,
        doctormail:appointment.doctormail,
        description:appointment.description,
        date:appointment.date,
        time:appointment.time
      });

      await rec.save();
      return res.status(201).json({success: true,msg:'appointment approved successfully'});

}
