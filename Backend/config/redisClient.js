const { createClient } = require("redis");

let pubClient = null;
let subClient = null;
let connecting = null;

async function getRedisClients() {
  if (pubClient && subClient) return { pubClient, subClient };
  if (connecting) return connecting;

  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error(
      "REDIS_URL is not set — required for the Socket.IO Redis adapter (chat/meeting sync across instances)"
    );
  }

  connecting = (async () => {
    const pub = createClient({ url });
    pub.on("error", (err) => console.error("Redis pub client error:", err.message));

    const sub = pub.duplicate();
    sub.on("error", (err) => console.error("Redis sub client error:", err.message));

    await Promise.all([pub.connect(), sub.connect()]);

    pubClient = pub;
    subClient = sub;
    return { pubClient, subClient };
  })();

  try {
    return await connecting;
  } finally {
    connecting = null;
  }
}

async function closeRedisClients() {
  await Promise.all([
    pubClient?.quit(),
    subClient?.quit(),
  ]);
  pubClient = null;
  subClient = null;
}

module.exports = { getRedisClients, closeRedisClients };
