require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let userSchema = new mongoose.Schema({
  username: { type: String, unique: true , required: true },
})

let exerciseSchema = new mongoose.Schema({
  username: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, required: true },
});

let User = mongoose.model("User", userSchema);
let Exercise = mongoose.model("Exercise", exerciseSchema);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", (req, res) => {
  console.log(req);
  const username = req.body.username;
  const newUser = new User({ username });
  newUser.save((err, doc) => {
    if (err) {
      res.json(err);
    } else {
      res.json({ username: doc.username, id: doc._id });
    }
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
