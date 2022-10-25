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
  username: { type: String, unique: true, required: true },
});

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

app
  .route("/api/users")
  .get((req, res) => {
    User.find({}, (_, docs) => {
      res.send(docs);
    });
  })
  .post((req, res) => {
    const username = req.body.username;
    const newUser = new User({ username });
    newUser.save((err, doc) => {
      if (err) {
        // Error adding an existing user:
        // {
        //   driver: true,
        //   name: "MongoError",
        //   index: 0,
        //   code: 11000,
        //   keyPattern: { username: 1 },
        //   keyValue: { username: "usertest" },
        // };
        res.json({ error: `Error trying to add user ${username}` });
      } else {
        res.json({ username: doc.username, id: doc._id });
      }
    });
  });

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
