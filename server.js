const Redis = require("ioredis");
const express = require("express");

const app = express();

const redis = new Redis({
  port: 6379,
  host: "localhost",
  password: process.env.REDIS_PASSWORD,
  enableOfflineQueue: false,
});

// const init = async () => {
//   await Promise.all([
//     redis.set("users:1", JSON.stringify({ id: 1, name: "alpha" })),
//     redis.set("users:2", JSON.stringify({ id: 2, name: "beta" })),
//   ]);
// };

const init = async () => {
  await redis.rpush("users:list", JSON.stringify({ id: 1, name: "alpha" }));
  await redis.rpush("users:list", JSON.stringify({ id: 2, name: "beta" }));
  await redis.rpush("users:list", JSON.stringify({ id: 3, name: "chi" }));
  await redis.rpush("users:list", JSON.stringify({ id: 4, name: "delta" }));
};

app.get("/", (req, res) => {
  res.status(200).send("hello\n");
});

app.get("/user/:id", async (req, res) => {
  try {
    const key = `users:${req.params.id}`;
    const val = await redis.get(key);
    const user = JSON.parse(val);
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("internal error");
  }
});

app.get("/users", async (req, res) => {
  try {
    const offset = req.query.offset ? Number(req.query.offset) : 0;
    const usersList = await redis.lrange("users:list", offset, offset + 2);

    const users = usersList.map((user) => {
      return JSON.parse(user);
    });

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("internal error");
  }
});

redis.once("ready", async () => {
  try {
    await init();

    app.listen(3000, () => {
      console.log("start lilstening");
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});

redis.on("error", (err) => {
  console.error(err);
  process.exit(1);
});
