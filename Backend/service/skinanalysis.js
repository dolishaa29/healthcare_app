const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SKIN_PROMPT = `You are a professional skincare analysis expert. Analyze the skin visible in this image and respond in this exact format:

**Skin Type:** (Oily / Dry / Combination / Normal)

**Detected Concerns:**
- List each concern on its own line

**Possible Causes:**
- List the cause for each concern

**Recommendations:**
- List 2-3 quick actionable tips

Keep it short and clear. If the image is blurry or does not show skin/face clearly, just say: "Image not clear enough for analysis."`;

exports.analyzeSkin = async (req, res) => {
  try {
    const { frame } = req.body;
    if (!frame) {
      return res.status(400).json({ success: false, message: "No frame provided" });
    }
    const base64Data = frame.replace(/^data:image\/\w+;base64,/, "");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      },
      SKIN_PROMPT,
    ]);

    res.status(200).json({
      success: true,
      analysis: result.response.text(),
    });

  } catch (error) {
    console.error("Skin analysis error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
