// CORS_ORIGINS is a comma-separated list of allowed origins, e.g.
// "https://auraahealth.vercel.app,http://localhost:5173" — lets the same
// build run behind different reverse-proxy/staging domains without a code
// change. Falls back to the current deployed frontend so existing
// deployments keep working if the env var isn't set yet.
const allowedOrigins = (process.env.CORS_ORIGINS || "https://auraahealth.vercel.app")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

module.exports = allowedOrigins;
