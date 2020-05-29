// ./mongod --dbpath ~/mongo-data/

var express = require("express");
var bodyParser = require("body-parser");

var { mongoose, ObjectID } = require("./db/mongoose");
var { Todo } = require("./models/todo");
var { User } = require("./models/user");

var app = express();
const port = 3000;

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
    .catch((e) => res.send(404));
});

app.listen(port, () => {
  console.log("Started on port: " + port);
});

module.exports = {
  app,
};
