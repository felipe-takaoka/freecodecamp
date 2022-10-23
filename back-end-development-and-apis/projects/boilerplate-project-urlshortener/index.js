require("dotenv").config();
const bodyParser = require("body-parser");
const dns = require("node:dns");
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");

const port = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
});

let Url = mongoose.model("Url", urlSchema);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", (req, res) => {
  const url = req.body.url;
  const { host } = new URL(url);

  dns.lookup(host, (err) => {
    if (err) {
      res.json({ error: "invalid url" });
    } else {
      const newUrl = new Url({ originalUrl: url });
      newUrl.save((err, doc) => {
        res.json({ original_url: url, short_url: doc._id });
      });
    }
  });
});

app.get("/api/shorturl/:id", (req, res) => {
  const { id } = req.params;
  if (id) {
    Url.findById(id, null, null, (err, doc) => {
      if (err) {
        res.json(err);
      } else {
        res.redirect(doc.originalUrl);
      }
    });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
