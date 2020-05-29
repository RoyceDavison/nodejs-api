const { mongoose } = require("./../server/db/mongoose");
const { Todo } = require("./../server/models/todo");
const { ObjectID } = require("mongodb");
const { User } = require("./../server/models/user");

var id = "5ecdf1f17d5cddbe78269043";
var fakedId = "123";

//mongoose does not require you to create ObjectID, it will do for your
// Todo.find({
//   _id: id,
// }).then((todos) => {
//   console.log("FIND: ", todos);
// });

// Todo.findOne({
//   completed: false,
// }).then((todo) => {
//   console.log("FIND_One: ", todo);
// });

// if (!ObjectID.isValid(fakedId)) {
//   console.log("ID is not valid");
// }
// Todo.findById(fakedId)
//   .then((todo) => {
//     if (!todo) return console.log("ID not found");
//     console.log("FindById: ", todo);
//   })
//   .catch((e) => console.log(e));

//1. query works but no user
//2. user found
//3. any other error

var userId = "5ecb6b42e60f7a717b397963";
var fakedUserId = "677b6b42e60f7a717b397963";

User.findById(fakedUserId)
  .then((user) => {
    if (!user) return console.log("No user");
    console.log("FindById: ", user);
  })
  .catch((e) => console.log(e));
