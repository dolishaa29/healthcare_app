const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not set in .env file");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

function getModel(options = {}) {
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash", ...options });
}

module.exports = { genAI, getModel, GEMINI_API_KEY };
