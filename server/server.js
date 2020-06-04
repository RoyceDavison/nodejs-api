// ./mongod --dbpath ~/mongo-data/
// node server/server.js or npm start
//How to resolve SocketException: Address already in use MongoDB???
//https://medium.com/@balasubramanim/how-to-resolve-socketexception-address-already-in-use-mongodb-75fa8ea4a2a6
require("./config/config");
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

var { mongoose, ObjectID } = require("./db/mongoose");
var { Todo } = require("./models/todo");
var { User } = require("./models/user");
var { authenticate } = require("./middleware/authenticate");

var app = express();
const port = process.env.PORT;

//By using this middleware, we are now able to send JASON to our express application
app.use(bodyParser.json());

//CRUD operations: create, read, update, delete
//make this router private
app.post("/todos", authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id,
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

app.get("/todos", authenticate, (req, res) => {
  Todo.find({ _creator: req.user._id }).then(
    (todos) => {
      res.send({ todos });
    },
    (err) => {
      res.status(400).send("Could not find the user");
    }
  );
});

app.get("/todos/:id", authenticate, (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send("Invalid id");
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id,
  })
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo });
    })
    .catch((e) => res.status(404).send());
});

app.delete("/todos/:id", authenticate, (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send("Invalid id");
  }
  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id,
  })
    .then((todo) => {
      if (!todo) return res.status(404).send();
      res.send({ todo });
    })
    .catch((e) => res.status(400).send());
});

app.patch("/todos/:id", authenticate, (req, res) => {
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
      _creator: req.user._id,
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

app.delete("/users/me/token", authenticate, (req, res) => {
  req.user.removeToken(req.token).then(
    () => {
      res.status(200).send();
    },
    (err) => {
      res.status(400).send(err);
    }
  );
});

app.get("/users/me", authenticate, (req, res) => {
  //console.log(res);
  res.send(req.user);
});

app.post("/users/login", (req, res) => {
  var body = _.pick(req.body, ["email", "password"]);
  User.findByCredentials(body.email, body.password)
    .then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header("x-auth", token).send(user);
      });
    })
    .catch((e) => {
      res.status(400).send("Fail to login.");
    });
});

app.listen(port, () => {
  console.log("Started on port: " + port);
});

module.exports = {
  app,
};
