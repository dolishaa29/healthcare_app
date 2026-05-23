let doctor = require('../model/doctor');
let user = require('../model/user');
let ratings = require('../model/doctorRating');


exports.getrating = async (req, res) => {
    try {
        console.log("heelo");
        let user=req.user;
        console.log(user);
        let { doctorId, userId, rating, description } = req.body;

        let newRating = new ratings({
            userId:user._id,
            doctorId,
            rating,
            description
        });

        await newRating.save();

        res.status(200).json({
            msg: "rating saved successfully",
            data: newRating
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "internal server error" });
    }
};


exports.viewrating = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        console.log("Doctor ID:", doctorId);
        let data = await ratings.find({ doctorId: doctorId });

        console.log("Fetched Data:", data);
        
        res.status(200).json({
            status: true,
            data: data
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "error" });
    }
};