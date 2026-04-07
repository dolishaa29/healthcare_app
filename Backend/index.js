const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

// ✅ सही origin (NO trailing slash)
const allowedOrigin = "https://auraahealth.vercel.app";

// ✅ CORS FIX (robust version)
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin || origin === allowedOrigin) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed: " + origin));
    }
  },
  credentials: true
}));

// ✅ handle preflight
app.options("*", cors());

// ✅ middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ static files (images)
app.use(express.static(path.join(__dirname, "public")));

// ✅ test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ✅ database
const { health } = require("./dbconnection");

// ✅ routes
app.use("/", require("./router/adminrouter"));
app.use("/", require("./router/doctorrouter"));
app.use("/", require("./router/userrouter"));
app.use("/", require("./router/appointrouter"));

// ✅ server start
const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});