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

// Chat history is always fetched by this exact pair, sorted by time —
// see getHistoryForUser/getHistoryForDoctor in service/chatservice.js.
messageSchema.index({ userId: 1, doctorId: 1, createdAt: 1 });

module.exports = mongo.model('message', messageSchema);
