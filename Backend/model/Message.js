let mongo = require("mongoose");

let messageSchema = mongo.Schema({
   userId: { type: String, required: true },
   doctorId: { type: String, required: true },

   senderRole: {
      type: String,
      enum: ["user", "doctor"],
      required: true
   },

   text: { type: String, required: true },

}, { timestamps: true });

module.exports = mongo.model('message', messageSchema);
