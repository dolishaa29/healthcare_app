let express = require("express");
let path = require("path");
let dotenv = require("dotenv");
let cors = require("cors");
let cookieParser = require("cookie-parser");

dotenv.config();

let app = express();

app.use(cors({
  origin: "https://auraahealth.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

let { health } = require("./dbconnection");

app.use("/", require("./router/adminrouter"));
app.use("/", require("./router/doctorrouter"));
app.use("/", require("./router/userrouter"));
app.use("/", require("./router/appointrouter"));

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Backend is working fine" });
});

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});