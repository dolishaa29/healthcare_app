
const allowedOrigins = (process.env.CORS_ORIGINS || "https://auraahealth.vercel.app")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

module.exports = allowedOrigins;
