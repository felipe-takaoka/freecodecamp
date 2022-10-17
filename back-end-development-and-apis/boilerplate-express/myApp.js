let express = require('express');
let app = express();

app.get("/", (req, res) => {
  const path = __dirname + "/views/index.html";
  res.sendFile(path);
});

app.use("/public", express.static(__dirname + "/public"));

module.exports = app;
