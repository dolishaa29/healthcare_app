const { appointrequest, viewappointment, appointmentstatus, approveappointment, getAvailableSlots, bookSlot } = require("../service/appointment");

exports.appointrequest=async(req,res)=>
{
    await appointrequest(req,res);
}

exports.viewappointment=async(req,res)=>
{
    await viewappointment(req,res);
}

exports.appointmentstatus=async(req,res)=>
{
    await appointmentstatus(req,res);
}

exports.approveappointment=async(req,res)=>
{
    await approveappointment(req,res);
}

exports.getAvailableSlots=async(req,res)=>
{
    await getAvailableSlots(req,res);
}

exports.bookSlot=async(req,res)=>
{
    await bookSlot(req,res);
}
