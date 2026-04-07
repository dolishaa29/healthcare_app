const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

// ✅ CORS FIX (NO trailing slash)
const allowedOrigin = "https://auraahealth.vercel.app";

app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

// ✅ Handle preflight requests
app.options("*", cors({
  origin: allowedOrigin,
  credentials: true
}));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Static files (images)
app.use(express.static(path.join(__dirname, "public")));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ✅ MongoDB connection (FIXED)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.error("MongoDB Error ❌", err));

// ✅ Routes
app.use("/", require("./router/adminrouter"));
app.use("/", require("./router/doctorrouter"));
app.use("/", require("./router/userrouter"));
app.use("/", require("./router/appointrouter"));

// ✅ Server start
const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});