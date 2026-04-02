let express = require("express");
let path = require("path");
let dotenv = require("dotenv");
let cors = require("cors");
let cookieParser = require("cookie-parser");

dotenv.config();

let app = express();
app.use(cors({
  origin: "https://auraahealth.vercel.app",
  //origin:"*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
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

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});