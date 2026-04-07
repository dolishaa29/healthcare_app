const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

// ✅ CORS FIX (no trailing slash + proper config)
app.use(cors({
  origin: "https://auraahealth.vercel.app", // ❗ NO trailing slash
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Handle preflight requests
app.options("*", cors());

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Static files (for images like health.jfif)
app.use(express.static(path.join(__dirname, "public")));

// ✅ Test route (IMPORTANT for debugging Render)
app.get("/", (req, res) => {
  res.send("API is running successfully 🚀");
});

// ✅ Database connection
const { health } = require("./dbconnection");

// ✅ Routes
app.use("/", require("./router/adminrouter"));
app.use("/", require("./router/doctorrouter"));
app.use("/", require("./router/userrouter"));
app.use("/", require("./router/appointrouter"));

// ✅ Start server
const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});