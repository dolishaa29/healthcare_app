const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

const corsOptions = {
  origin: "https://auraahealth.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

require("./dbconnection");

// ✅ test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Backend is working fine" });
});

// ✅ routes
app.use("/", require("./router/adminrouter"));
app.use("/", require("./router/doctorrouter"));
app.use("/", require("./router/userrouter"));
app.use("/", require("./router/appointrouter"));

// ✅ optional global error handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
    error: err.message
  });
});

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});