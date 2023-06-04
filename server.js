const express = require("express");
const dayjs = require("dayjs");

const app = express();

// HTTPメソッドとリクエストのURL(root以下の文字列)をconsoleに出力するミドルウェア
const logMiddleWare = (req, res, next) => {
  const now = dayjs();
  console.log(now["$d"], req.method, req.url);
  next();
};

app.use(logMiddleWare);

app.get("/", (req, res, next) => {
  res.status(200).send("hello!\n");
});

app.get("/user/:id", (req, res) => {
  res.status(200).send(req.params.id);
});

app.listen(3000, () => {
  console.log("start listening");
});
