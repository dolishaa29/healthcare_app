let express=require("express");
let auth=require("../middleware/admin");
let auths=require("../middleware/user");
let authd=require("../middleware/doctor");
const { appointrequest, viewappointment, appointmentstatus, approveappointment, getAvailableSlots, bookSlot, getBriefing } = require("../service/appointment");
let router=express.Router();


router.post("/appointrequest",auths ,appointrequest);
router.get("/viewappointment",auth, viewappointment);
router.put("/appointmentstatus",appointmentstatus);
router.post("/approveappointment",approveappointment);
router.get("/available-slots", auths, getAvailableSlots);
router.post("/book-slot", auths, bookSlot);
router.get("/appointment/:appointmentId/briefing", authd, getBriefing);
module.exports=router;
