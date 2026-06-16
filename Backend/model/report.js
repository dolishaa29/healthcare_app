import mongo from "mongoose";

const messageSchema = new mongo.Schema(
  {
    role: { type: String, enum: ["user", "bot"], required: true },
    text: { type: String, required: true },
    isPdf: { type: Boolean, default: false },
  },
  { _id: false }
);

const chatSchema = new mongo.Schema(
  {
    user:   { type: mongo.Schema.Types.ObjectId, ref: "user", required: true },
    title:  { type: String, required: true },
    summary: { type: String },
    pdfUrl: { type: String },
    messages: [messageSchema],
  }
);

export default mongo.model("reportai", chatSchema);