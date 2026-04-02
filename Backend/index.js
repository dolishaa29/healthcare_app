let express = require("express");
let path = require("path");
let dotenv = require("dotenv");
let cors = require("cors");
let cookieParser = require("cookie-parser");

dotenv.config();

let app = express();

// ✅ CORS setup
app.use(cors({
  //origin: "https://auraahealth.vercel.app",
  origin:"http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ❌ REMOVE this line (problematic)
// app.options("*", cors());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// DB connection
let { health } = require("./dbconnection");

// Routes
app.use("/", require("./router/adminrouter"));
app.use("/", require("./router/doctorrouter"));
app.use("/", require("./router/userrouter"));
app.use("/", require("./router/appointrouter"));

// Test route (optional but useful)
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// Server start
const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});