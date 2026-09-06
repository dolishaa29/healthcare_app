let rec4=require("../model/Appointment/appointrequest");
let rec5=require("../model/Appointment/appointment");
let rec=require("../model/doctor");
const Report = require("../model/report");
const { getModel } = require("../config/gemini");
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

    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit, 10);

    if (!page || !limit) {
        let appointments=await rec4.find();
        return res.status(200).json({success: true,msg:'appointment requests fetched successfully',appointments});
    }

    const skip = (page - 1) * limit;
    const [appointments, total] = await Promise.all([
        rec4.find().skip(skip).limit(limit),
        rec4.countDocuments(),
    ]);
    return res.status(200).json({
        success: true,
        msg: 'appointment requests fetched successfully',
        appointments,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    });
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

function generateTimeSlots(bookedTimes) {
  const allTimes = [
    "01:22","09:00","09:30","10:00","10:30","11:00","11:30",
    "12:00","12:30","13:00","13:30","14:00","14:30",
    "15:00","15:30","16:00","16:30"
  ];
  const slots = [];
  for (let i = 0; i < allTimes.length; i++) {
    slots.push({ time: allTimes[i], available: !bookedTimes.includes(allTimes[i]) });
  }
  return slots;
}

exports.getAvailableSlots = async (req, res) => {
  const user = req.user;
  const { doctorid, date } = req.query;

  if (!doctorid || !date) {
    return res.status(400).json({ success: false, msg: 'doctorid and date are required' });
  }

  const doctor = await rec.findOne({ _id: doctorid });
  if (!doctor) {
    return res.status(404).json({ success: false, msg: 'Doctor not found' });
  }

  const userAppointmentOnDate = await rec5.findOne({ userid: user._id.toString(), date });
  if (userAppointmentOnDate) {
    return res.status(200).json({
      success: true,
      slots: [],
      hasAppointmentToday: true,
      msg: 'You already have an appointment on this date'
    });
  }

  const booked = await rec5.find({ doctorid, date });
  const bookedTimes = booked.map(a => a.time);
  const slots = generateTimeSlots(bookedTimes);

  return res.status(200).json({ success: true, slots, hasAppointmentToday: false });
};

exports.bookSlot = async (req, res) => {
  const user = req.user;
  const { doctorid, date, time, description } = req.body;

  if (!doctorid || !date || !time || !description) {
    return res.status(400).json({ success: false, msg: 'All fields are required' });
  }

  const doctor = await rec.findOne({ _id: doctorid });
  if (!doctor) {
    return res.status(404).json({ success: false, msg: 'Doctor not found' });
  }

  const existingUserApp = await rec5.findOne({ userid: user._id.toString(), date });
  if (existingUserApp) {
    return res.status(400).json({ success: false, msg: 'You already have an appointment on this date. Only one appointment per day is allowed.' });
  }

  const slotTaken = await rec5.findOne({ doctorid, date, time });
  if (slotTaken) {
    return res.status(400).json({ success: false, msg: 'This slot was just taken. Please choose another.' });
  }

  const appointment = new rec5({
    userid: user._id,
    name: user.name,
    email: user.email,
    doctorid,
    doctormail: doctor.email,
    description,
    date,
    time
  });

  try {
    await appointment.save();
  } catch (err) {
    // Unique index on {doctorid, date, time} is the real guard against a
    // double-booking race — the findOne check above can't prevent two
    // concurrent requests (e.g. hitting different server instances) from
    // both passing it before either writes.
    if (err.code === 11000) {
      return res.status(400).json({ success: false, msg: 'This slot was just taken. Please choose another.' });
    }
    throw err;
  }

  return res.status(201).json({ success: true, msg: 'Appointment booked successfully!' });
};

exports.getBriefing = async (req, res) => {
  const doctor = req.doctor;
  const { appointmentId } = req.params;

  const appointment = await rec5.findById(appointmentId);
  if (!appointment) {
    return res.status(404).json({ success: false, msg: 'Appointment not found' });
  }
  if (String(appointment.doctorid) !== String(doctor._id)) {
    return res.status(403).json({ success: false, msg: 'You are not part of this appointment' });
  }

  const reports = await Report.find({ user: appointment.userid })
    .select('title summary createdAt')
    .sort({ createdAt: -1 })
    .limit(5);

  const pastAppointments = await rec5.find({ userid: appointment.userid, _id: { $ne: appointment._id } })
    .select('description date')
    .sort({ date: -1 })
    .limit(5);

  if (!reports.length && !pastAppointments.length) {
    return res.status(200).json({ success: true, text: 'No prior records on file for this patient yet.' });
  }

  const context = [
    reports.length
      ? 'Recent report summaries:\n' + reports.map((r) => `- [${r.createdAt.toDateString()}] ${r.title}: ${r.summary}`).join('\n')
      : '',
    pastAppointments.length
      ? 'Past appointment notes:\n' + pastAppointments.map((a) => `- [${a.date}] ${a.description}`).join('\n')
      : '',
  ].filter(Boolean).join('\n\n');

  const model = getModel();
  const result = await model.generateContent(
    `You are briefing a doctor right before a consultation. Summarize the following patient history into 3-4 short bullet points, highlighting anything clinically relevant.\n\n${context}`
  );

  return res.status(200).json({ success: true, text: result.response.text() });
};
