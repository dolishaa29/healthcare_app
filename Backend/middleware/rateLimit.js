const rateLimit = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const { getRedisClients } = require("../config/redisClient");

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

const skinAnalysisLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({ sendCommand, prefix: "rl:skin:" }),
  message: { success: false, message: "Too many requests, please slow down." },
});

const triageLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({ sendCommand, prefix: "rl:triage:" }),
  message: { success: false, message: "Too many requests, please slow down." },
});

const hospitalLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({ sendCommand, prefix: "rl:hospital:" }),
  message: { success: false, message: "Too many requests, please slow down." },
});

module.exports = { chatLimiter, skinAnalysisLimiter, triageLimiter, hospitalLimiter };
