const { GoogleGenerativeAI } = require("@google/generative-ai");
const cloudinary = require("../config/cloudinary");
const Report = require("../model/report");
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not set in .env file");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// One endpoint for the whole report chat:
// - send a PDF file -> starts a new report thread with the AI's analysis as the first bot message.
// - send { text, reportId } -> asks a follow-up question inside that thread.
exports.handleReport = async (req, res) => {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(400).json({ success: false, message: "GEMINI_API_KEY is not configured" });
    }

    if (req.file) {
      const title = req.file.originalname || "Untitled Report";

      const result = await model.generateContent([
        "Analyze this medical report in simple terms. Mention key findings, abnormal values, and suggestions.",
        { inlineData: { data: req.file.buffer.toString("base64"), mimeType: req.file.mimetype } },
      ]);
      const summary = result.response.text();

      const uploaded = await cloudinary.uploadBuffer(req.file.buffer, {
        public_id: `${req.user._id}_${Date.now()}`,
      });

      const report = await Report.create({
        user: req.user._id,
        title,
        summary,
        fileUrl: uploaded.secure_url,
        messages: [
          { role: "user", text: title, isPdf: true },
          { role: "bot", text: summary },
        ],
      });

      return res.status(200).json({ success: true, report });
    }

    const { text, reportId } = req.body;
    if (!text || !reportId) {
      return res.status(400).json({ success: false, message: "Send a PDF file, or { text, reportId } to continue chatting" });
    }

    const result = await model.generateContent(text);
    const responseText = result.response.text();

    await Report.findOneAndUpdate(
      { _id: reportId, user: req.user._id },
      { $push: { messages: { $each: [{ role: "user", text }, { role: "bot", text: responseText }] } } }
    );

    res.status(200).json({ success: true, text: responseText });
  } catch (error) {
    console.error("Report Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// One endpoint for fetching reports:
// - no query -> list of all the user's report threads.
// - ?id=<reportId> -> the full thread (messages included) for that report.
exports.getReports = async (req, res) => {
  try {
    if (req.query.id) {
      const report = await Report.findOne({ _id: req.query.id, user: req.user._id });
      if (!report) {
        return res.status(404).json({ success: false, message: "Report not found" });
      }
      return res.status(200).json({ success: true, report });
    }

    const reports = await Report.find({ user: req.user._id })
      .select("title summary fileUrl createdAt")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
