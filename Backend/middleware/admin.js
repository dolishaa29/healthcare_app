  let adminmodel=require("../model/admin");
const jwt = require("jsonwebtoken");

async function auth(req, res, next) {
  try {
    if (req.cookies.emtoken != undefined && req.cookies.emtoken != "") {
      const token = req.cookies.emtoken;
      
      const data = jwt.verify(token, "aabb");
      let admin = await adminmodel.findOne({ email: data.token });
      
      if (!admin) return res.status(403).json({ msg: "admin not found" });
      else{
      req.admin = admin;
      next();
      }
    } else {
      console.log("Please Login First");
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
