let adminmodel = require("../model/admin");
const jwt = require("jsonwebtoken");

async function auth(req, res, next) {
  try {
    const token = req.cookies.emtoken || req.headers.authorization?.split(" ")[1];

    if (token != undefined && token != "") {
      const data = jwt.verify(token, process.env.JWT_SECRET);
      let admin = await adminmodel.findOne({ email: data.token });
      
      if (!admin) return res.status(403).json({ msg: "admin not found" });
      else {
        req.admin = admin;
        next();
      }
    } else {
      console.log("Please Login First");
      return res.status(401).json({ msg: "Please Login First" });
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