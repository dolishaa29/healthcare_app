let usermodel = require("../model/user");
const jwt = require("jsonwebtoken");

async function optionalAuth(req, res, next) {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) return next();

    const data = jwt.verify(token, process.env.JWT_SECRET);
    const user = await usermodel.findOne({ email: data.token });
    if (user) req.user = user;

    next();
  } catch (err) {
    next();
  }
}

module.exports = optionalAuth;
