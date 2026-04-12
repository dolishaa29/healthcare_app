let doctor=require('../model/doctor');
let user=require('../model/user');
let ratings=require('../model/doctorRating');

exports.getrating=async(req,res)=>
{
    try{
        let {doctormail,usermail,rating,description}=req.body;
        let ratingss=await ratings({doctormail,usermail,rating,description});
        await ratingss.save();
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({msg:"internal server error"})
    }
}
 
exports.viewrating=async(req,res)=>
{
  try {
    const data = await ratings.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "usermail",
          foreignField: "email",
          as: "user"
        }
      },
      {
        $lookup: {
          from: "doctors",
          localField: "doctormail",
          foreignField: "email",
          as: "doctor"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $unwind: "$doctor"
      }
    ]);

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
