const { getModel, GEMINI_API_KEY } = require("../config/gemini");
const Report = require("../model/report");

exports.chat = async (req, res) => {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(400).json({
        success: false,
        message: "GEMINI_API_KEY is not configured",
      });
    }

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    let fullPrompt = prompt;

    if (req.user) {
      const reports = await Report.find({ user: req.user._id })
        .select("title summary createdAt")
        .sort({ createdAt: -1 })
        .limit(5);

      if (reports.length) {
        const context = reports
          .map((r) => `- [${r.createdAt.toDateString()}] ${r.title}: ${r.summary}`)
          .join("\n");
        fullPrompt = `The patient asking this question has the following recent medical report summaries on file. Use them only if relevant to the question below; otherwise ignore them and answer normally.\n\n${context}\n\nPatient question: ${prompt}`;
      }
    }

    const model = getModel();

    const result = await model.generateContent(fullPrompt);

    res.status(200).json({
      success: true,
      text: result.response.text(),
    });
  } catch (error) {
    console.error("Gemini Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
