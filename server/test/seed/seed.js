const { ObjectID } = require("mongodb");
const jwt = require("jsonwebtoken");

const { Todo } = require("../../models/todo");
const { User } = require("../../models/user");

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const userThreeId = new ObjectID();

const users = [
  {
    _id: userOneId,
    email: "test1@gmail.com",
    password: "test1123",
    tokens: [
      {
        access: "auth",
        token: jwt
          .sign({ _id: userOneId, access: "auth" }, process.env.JWT_SECRET)
          .toString(),
      },
    ],
  },
  {
    _id: userTwoId,
    email: "test2@gmail.com",
    password: "test2123",
    tokens: [
      {
        access: "auth",
        token: jwt
          .sign({ _id: userTwoId, access: "auth" }, process.env.JWT_SECRET)
          .toString(),
      },
    ],
  },
];

const todos = [
  {
    _id: userOneId,
    text: "Test 1",
    _creator: userOneId,
  },
  {
    _id: userTwoId,
    text: "Test 2",
    completed: true,
    completedAt: 333,
    _creator: userTwoId,
  },
  {
    _id: userThreeId,
    text: "Test 3",
    _creator: userThreeId,
  },
];

//empty the database
const populateTodos = (done) => {
  Todo.deleteMany({})
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => done());
};

/*insertMany will not run our middleware which means 
when we insert these records, the plain text password will be stored in the database */
const populateUsers = (done) => {
  User.deleteMany({})
    .then(() => {
      var userOne = new User(users[0]).save(); //save() return promise used to sync
      var userTwo = new User(users[1]).save();

      //then only fired for Promise.all() when the [userOne, userTwo] finish the insertion into databse
      //Promise.all([userOne, userTwo]).then();
      return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
};

module.exports = {
  todos,
  users,
  populateTodos,
  populateUsers,
};
