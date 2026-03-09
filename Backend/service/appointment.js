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

}