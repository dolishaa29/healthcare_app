let usermodel = require("../model/user");
const jwt = require("jsonwebtoken");

async function auth(req, res, next) {
  try {
    // ADDED: Fallback to check Authorization header if cookie is missing
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (token != undefined && token != "") {
      console.log("token in auth middleware:", token);
      const data = jwt.verify(token, process.env.JWT_SECRET);
      console.log("data in auth middleware:", data);
      
      // Note: Ensure your login controller uses { token: email } in the payload
      let user = await usermodel.findOne({ email: data.token });
      
      if (!user) return res.status(403).json({ msg: "user not found" });
      else {
        req.user = user;
        next();
      }
    } else {
      console.log("Please Login First");
      // ADDED: You must send a response here or the frontend will wait forever
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