const { getModel, GEMINI_API_KEY } = require("../config/gemini");
const cloudinary = require("../config/cloudinary");
const Report = require("../model/report");

const model = getModel();



exports.handleReport = async (req, res) => {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(400).json({ success: false, message: "GEMINI_API_KEY is not configured" });
    }

    if (req.file) {
      const title = req.file.originalname || "Untitled Report";

      const result = await model.generateContent([
        "You're explaining this medical report directly to the patient, in a warm, natural voice — like a doctor talking them through it, not filling out a form. Write it as flowing paragraphs, not a rigid template or bullet checklist. Walk through what the report actually found, explain anything abnormal in plain language and why it matters, and close with practical, reassuring next steps. Keep medical jargon to a minimum and explain any term you do use.",
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
        publicId: uploaded.public_id,
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

exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    if (report.publicId) {
      try {
        await cloudinary.uploader.destroy(report.publicId, { resource_type: "image" });
      } catch (err) {
        console.error("Cloudinary cleanup error:", err.message);
      }
    }

    res.status(200).json({ success: true, message: "Report deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTrends = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user._id })
      .select("title summary createdAt")
      .sort({ createdAt: 1 });

    if (reports.length < 2) {
      return res.status(200).json({
        success: true,
        text: "Not enough report history yet to identify trends — upload at least two reports over time.",
      });
    }

    const history = reports
      .map((r) => `- [${r.createdAt.toDateString()}] ${r.title}: ${r.summary}`)
      .join("\n");

    const result = await model.generateContent(
      `Here is a patient's medical report history, oldest first:\n\n${history}\n\nIdentify any trends, changes, or recurring concerns across these reports over time (e.g. values improving or worsening, patterns worth flagging). Keep it short and in simple terms for the patient.`
    );

    res.status(200).json({ success: true, text: result.response.text() });
  } catch (error) {
    console.error("Report trends error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
