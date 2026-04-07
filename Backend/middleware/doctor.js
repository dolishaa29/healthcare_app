let doctormodel = require("../model/doctor");
const jwt = require("jsonwebtoken");

async function auth(req, res, next) {
  try {
    const token = req.cookies.emstoken || req.headers.authorization?.split(" ")[1];

    if (token != undefined && token != "") {
      const data = jwt.verify(token, process.env.JWT_SECRET);
      
      let doctor = await doctormodel.findOne({ email: data.token });
      
      if (!doctor) return res.status(403).json({ msg: "Doctor not found" });
      else {
        req.doctor = doctor;
        next();
      }
    } else {
      return res.status(401).json({ msg: "Please login first" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
}

module.exports = auth;