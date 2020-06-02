// ./mongod --dbpath ~/mongo-data/
// node server/server.js or npm start

require("./config/config");
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

var { mongoose, ObjectID } = require("./db/mongoose");
var { Todo } = require("./models/todo");
var { User } = require("./models/user");

var app = express();
const port = process.env.PORT;

//By using this middleware, we are now able to send JASON to our express application
app.use(bodyParser.json());

//CRUD operations: create, read, update, delete
app.post("/todos", (req, res) => {
  var todo = new Todo({
    text: req.body.text,
  });

  todo.save().then(
    (doc) => {
      res.send(doc);
    },
    (err) => {
      //console.log(err);
      res.status(400).send(err);
    }
  );
});

app.get("/todos", (req, res) => {
  Todo.find().then(
    (todos) => {
      res.send({ todos });
    },
    (err) => {
      res.status(400).send(err);
    }
  );
});

app.get("/todos/:id", (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send("Invalid id");
  }

  Todo.findById(id)
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo });
    })
    .catch((e) => res.status(404).send());
});

app.delete("/todos/:id", (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send("Invalid id");
  }
  Todo.findByIdAndRemove(id)
    .then((todo) => {
      if (!todo) return res.status(404).send();
      res.send({ todo });
    })
    .catch((e) => res.status(400).send());
});

app.patch("/todos/:id", (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ["text", "completed"]); //body is a copy from req.body with two properties are the same as req.body
  //console.log(body);
  if (!ObjectID.isValid(id)) res.status(404).send("Invalid ID");
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $set: body,
    },
    {
      new: true,
    }
  )
    .then((todo) => {
      if (!todo) res.status(404).send();
      res.send({ todo });
    })
    .catch((e) => res.status(400).send());
});

app.post("/users", (req, res) => {
  const body = _.pick(req.body, ["email", "password"]);
  const user = new User(body);
  user
    .save()
    .then(() => {
      return user.generateAuthToken(); //expect a chain promise which we defined in user.js
    })
    .then((token) => {
      res.header("x-auth", token).send(user);
    })
    .catch((e) => res.send(400).send(e));
});

app.listen(port, () => {
  console.log("Started on port: " + port);
});

module.exports = {
  app,
};
