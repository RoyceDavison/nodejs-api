const { mongoose } = require("../server/db/mongoose");
const { Todo } = require("../server/models/todo");
const { ObjectID } = require("mongodb");
const { User } = require("../server/models/user");

//这个是moongoose-remove, 前面那个是mongodb-delete
// Todo.remove({}).then((res) => {    //remove all
//   console.log(res);
// });

Todo.findOneAndRemove({ _id: "5ed13a4c6dc160628efcfc13" }).then((doc) => {
  console.log(doc);
});

// Todo.findByIdAndRemove("5ed13a436dc160628efcfc06").then((doc) => {
//   console.log(doc);
// });
