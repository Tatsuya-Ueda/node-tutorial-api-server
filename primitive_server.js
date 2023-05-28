const http = require("http");
http
  .createServer((req, res) => {
    res.write("hello!\n");
    res.end();
  })
  .listen(3000);
