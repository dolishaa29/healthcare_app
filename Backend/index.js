let express = require("express");
let path = require("path");
let dotenv = require("dotenv");
let cors = require("cors");
let cookieParser = require("cookie-parser");
let http = require("http");
let initChatSocket = require("./socket/chatSocket");

dotenv.config();

let app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

let health = require("./dbconnection");

app.use("/", require("./router/adminrouter"));
app.use("/", require("./router/doctorrouter"));
app.use("/", require("./router/userrouter"));
app.use("/", require("./router/appointrouter"));
app.use("/", require("./router/ratingrouter"));
app.use("/", require("./router/botrouter"));
app.use("/", require("./router/chatrouter"));
app.use("/", require("./router/reportanalysis"));

const PORT = process.env.PORT || 5000;

// wrap express in a raw http server so socket.io can share the same port
let server = http.createServer(app);
initChatSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
