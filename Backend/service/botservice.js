const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

//const GEMINI_API_KEY = process.env.GEMINI_API_KEY;


if (!GEMINI_API_KEY) {
  console.warn(" GEMINI_API_KEY is not set in .env file");
}require("dotenv").config();

console.log(process.env.GEMINI_API_KEY);


const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

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

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(prompt);

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
