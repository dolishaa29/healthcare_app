let mongo = require("mongoose");

let messageSchema = new mongo.Schema(
  {
    role: { type: String, enum: ["user", "bot"], required: true },
    text: { type: String, required: true },
    isPdf: { type: Boolean, default: false },
  },
  { _id: false }
);


let reportSchema = new mongo.Schema(
  {
    user: { type: mongo.Schema.Types.ObjectId, ref: "user", required: true },
    title: { type: String, required: true },
    summary: { type: String },
    fileUrl: { type: String },
    publicId: { type: String },
    messages: [messageSchema],
  },
  { timestamps: true }
);

module.exports = mongo.model("report", reportSchema);
