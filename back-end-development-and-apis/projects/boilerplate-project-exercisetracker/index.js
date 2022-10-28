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
  user_id: { type: String, required: true },
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
        res.json({ error: `Error trying to add user ${username}` });
      } else {
        res.json({ username: doc.username, _id: doc._id });
      }
    });
  });

app.post("/api/users/:_id/exercises", (req, res) => {
  const user_id = req.params._id;
  const date = req.body.date ? new Date(req.body.date) : new Date();
  const { description, duration } = req.body;
  const newExercise = new Exercise({ user_id, description, duration, date });

  User.findById(user_id, null, null, (err, user_data) => {
    if (err) {
      res.send(`Error finding user ${user_id}`);
    } else {
      newExercise.save((err, exercise_data) => {
        const { _id, username } = user_data._doc;
        const { description, duration, date } = exercise_data._doc;
        res.json({
          _id,
          username,
          description,
          duration,
          date: date.toDateString(),
        });
      });
    }
  });
});

app.get("/api/users/:_id/logs", (req, res) => {
  const user_id = req.params._id;
  const { from, to, limit } = req.query;
  let query = { user_id };
  query = from ? { ...query, date: { $gte: new Date(from) } } : query;
  query = to
    ? { ...query, date: { ...query.date, $lte: new Date(to) } }
    : query;
  const done = (err, docs) => {
    if (err) {
      res.send(err);
      // res.send(`Error finding user ${user_id}`);
    } else {
      const logs = {
        log: docs.map(({ user_id, description, duration, date }) => ({
          user_id,
          duration: parseInt(duration),
          description: description.toString(),
          date: date.toDateString(),
        })),
        count: docs.length,
      };
      res.send(logs);
    }
  };

  const parsedLimit = parseInt(limit);
  const exQuery = Exercise.find(query);
  if (parsedLimit) {
    exQuery.limit(parsedLimit).exec(done);
  } else {
    exQuery.exec(done);
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
