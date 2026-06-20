let mongo = require("mongoose");

let pendingUserSchema = mongo.Schema({
   email: { type: String, unique: true },
   name: { type: String },
   password: { type: String },
   contact: { type: String },
   address: { type: String },
   otp: { type: String },
   createdAt: { type: Date, default: Date.now, expires: 600 }
});

module.exports = mongo.model('pendingusers', pendingUserSchema);
