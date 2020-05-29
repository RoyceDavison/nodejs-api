// const MongoClient = require("mongodb").MongoClient;

//ES6 object deconstructing
const { MongoClient, ObjectID } = require("mongodb");

//first argument: url where your database lived (e.x amazon web service / local host)
//second argument: callback function which will fired after the connect is either successed or failed
MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, client) => {
  if (err) {
    return console.log("Unable to connect to MongoDB database");
  }
  console.log();
  console.log("Connected to MongoDB database");
  const db = client.db("TodoApp");

  //   db.collection("Todos").insertOne(
  //     {
  //       text: "Something to do",
  //       completed: false,
  //     },
  //     (err, result) => {
  //       if (err) {
  //         return console.log("Unable to insert todo: ", err);
  //       }
  //       console.log(JSON.stringify(result.ops, undefined, 2)); //result.ops stores all the documents we inserted
  //     }
  //   );

  //   db.collection("Users").insertOne(
  //     {
  //       name: "Royce",
  //       age: 21,
  //       location: "Boston",
  //     },
  //     (err, result) => {
  //       if (err) {
  //         return console.log("Unable to insert user: ", err);
  //       }
  //       console.log(result.ops[0]._id.getTimestamp());
  //     }
  //   );

  client.close();
});
