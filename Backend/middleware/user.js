let usermodel=require("../model/user");
const jwt = require("jsonwebtoken");

async function auth(req, res, next) {
  try {
    if (req.cookies.token != undefined && req.cookies.token != "") {
      const token = req.cookies.token;
      console.log("token in auth middleware:", token);
      const data = jwt.verify(token, "aabb");
      console.log("data in auth middleware:", data);
      let user = await usermodel.findOne({ email: data.token });
      
      if (!user) return res.status(403).json({ msg: "user not found" });
      else{
      req.user = user;
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
