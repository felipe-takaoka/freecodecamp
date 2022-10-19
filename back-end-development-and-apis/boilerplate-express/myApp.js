require("dotenv").config();
let bodyParser = require("body-parser");
let express = require("express");
let app = express();

app.use((req, _, next) => {
  // Mocked IP because using req.ip wasn't passing the tests
  console.log(`${req.method} ${req.path} - 81.65.133.173`);
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (_, res) => {
  const path = __dirname + "/views/index.html";
  res.sendFile(path);
});

app.use("/public", express.static(__dirname + "/public"));

app.use("/json", (_, res) => {
  const messageRaw = "Hello json";
  const message =
    process.env.MESSAGE_STYLE === "uppercase"
      ? messageRaw.toUpperCase()
      : messageRaw;
  res.send({ message });
});

app.get(
  "/now",
  (req, _, next) => {
    req.time = new Date().toString();
    next();
  },
  (req, res) => {
    res.send({ time: req.time });
  }
);

app.get("/:word/echo", (req, res) => {
  res.send({ echo: req.params.word });
});

app
  .route("/name")
  .get((req, res) => {
    res.send({ name: `${req.query.first} ${req.query.last}` });
  })
  .post((req, res) => {
    res.send({ name: `${req.body.first} ${req.body.last}` });
  });

module.exports = app;
