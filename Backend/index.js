let express = require("express");
let os = require("os");
let path = require("path");
let dotenv = require("dotenv");
let cors = require("cors");
let cookieParser = require("cookie-parser");
let compression = require("compression");
let http = require("http");
let initChatSocket = require("./socket/chatSocket");

dotenv.config();

let app = express();

app.set("trust proxy", 1);

let allowedOrigins = require("./config/corsOrigins");

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

let health = require("./dbconnection");
let { closeRedisClients } = require("./config/redisClient");

app.get("/healthz", (req, res) => {
  const dbConnected = health.readyState === 1;
  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? "ok" : "degraded",
    db: dbConnected ? "connected" : "disconnected",
    instance: os.hostname(),
  });
});

app.use("/", require("./router/adminrouter"));
app.use("/", require("./router/doctorrouter"));
app.use("/", require("./router/userrouter"));
app.use("/", require("./router/appointrouter"));
app.use("/", require("./router/ratingrouter"));
app.use("/", require("./router/botrouter"));
app.use("/", require("./router/chatrouter"));
app.use("/", require("./router/reportanalysis"));
app.use("/", require("./router/skinanalysis"));

const PORT = process.env.PORT || 5000;

let server = http.createServer(app);
let io;

let isShuttingDown = false;

async function shutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`${signal} received, shutting down gracefully...`);

  const forceExit = setTimeout(() => {
    console.error("Graceful shutdown timed out, forcing exit");
    process.exit(1);
  }, 10000);
  forceExit.unref();

  io?.close();
  server.close(async () => {
    console.log("HTTP server closed");
    try {
      await health.close();
      console.log("MongoDB connection closed");
    } catch (err) {
      console.error("Error closing MongoDB connection:", err.message);
    }
    try {
      await closeRedisClients();
      console.log("Redis connections closed");
    } catch (err) {
      console.error("Error closing Redis connections:", err.message);
    }
    clearTimeout(forceExit);
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));


(async () => {
  try {
    io = await initChatSocket(server);
  } catch (err) {
    console.error("Failed to initialize Socket.IO:", err.message);
    process.exit(1);
  }

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
