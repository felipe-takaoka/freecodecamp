require("dotenv").config();
let express = require("express");
let app = express();

app.get("/", (_, res) => {
  const path = __dirname + "/views/index.html";
  res.sendFile(path);
});

app.use("/public", express.static(__dirname + "/public"));

app.use("/json", (req, res) => {
  const messageRaw = "Hello json";
  const message =
    process.env.MESSAGE_STYLE === "uppercase"
      ? messageRaw.toUpperCase()
      : messageRaw;
  res.send({ message });
});

module.exports = app;
