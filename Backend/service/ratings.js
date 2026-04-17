let doctor = require('../model/doctor');
let user = require('../model/user');
let ratings = require('../model/doctorRating');


exports.getrating = async (req, res) => {
    try {
        let { doctorId, userId, rating, description } = req.body;

        let newRating = new ratings({
             doctorId,
             userId,
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
        let data = await ratings.aggregate([
            {
                $lookup: {
                    from: "doctors",
                    localField: "doctorId",
                    foreignField: "_id",
                    as: "doctor"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$doctor"
            },
            {
                $unwind: "$user"
            },
            
        ]);

        res.status(200).json({
            msg: "ratings fetched successfully",data
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "internal server error" });
    }
};