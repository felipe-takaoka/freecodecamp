// index.js
// where your node app starts

// init project
var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.get("/api/:date", (req, res) => {
  const dateParam = req.params.date;
  let date = new Date(dateParam);

  if (isNaN(date)) {
    date = new Date(parseInt(dateParam));
  }
  if (isNaN(date)) {
    res.json({ error: "Invalid Date" });
  }
  res.json({ unix: date.valueOf(), utc: date.toUTCString() });
});

app.get("/api/", (_, res) => {
  const now = Date.now();
  res.json({ unix: now.valueOf(), utc: now.toString() });
});

// listen for requests :)
var listener = app.listen(process.env.PORT || 4000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
