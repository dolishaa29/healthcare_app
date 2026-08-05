const rateLimit = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const { getRedisClients } = require("../config/redisClient");

// These two routes call the (paid, per-request) Gemini API and previously
// had no auth and no throttling — anyone could hammer them directly and run
// up the bill. Backed by Redis (not the default in-memory store) so the
// limit is actually enforced across every server instance, not reset per
// instance behind the load balancer.
async function sendCommand(...args) {
  const { pubClient } = await getRedisClients();
  return pubClient.sendCommand(args);
}

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({ sendCommand, prefix: "rl:chat:" }),
  message: { success: false, message: "Too many requests, please slow down." },
});

// LiveCapture.jsx posts one frame roughly every 5s while a session is open,
// so the limit needs enough headroom for sustained normal use.
const skinAnalysisLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({ sendCommand, prefix: "rl:skin:" }),
  message: { success: false, message: "Too many requests, please slow down." },
});

module.exports = { chatLimiter, skinAnalysisLimiter };
