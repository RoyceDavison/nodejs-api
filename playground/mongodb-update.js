const { MongoClient, ObjectID } = require("mongodb");
const mongoclient = new MongoClient("mongodb://localhost:27017/TodoApp", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoclient.connect((err, client) => {
  if (err) {
    return console.log("Unable to connect MongoDB: ", err);
  }
  console.log();
  console.log("Connect to MongoDB database");

  const todoCollection = client.db("TodoApp").collection("Todos");
  const userCollection = client.db("TodoApp").collection("Users");

  // todoCollection
  //   .findOneAndUpdate(
  //     {
  //       _id: new ObjectID("5ecb1e56a38c156cf0f9ce4d"),
  //     },
  //     {
  //       $set: {
  //         completed: true,
  //       },
  //     },
  //     {
  //       returnOriginal: false,
  //     }
  //   )
  //   .then((res) => {
  //     console.log(JSON.stringify(res, undefined, 2));
  //   });

  userCollection
    .findOneAndUpdate(
      {
        _id: new ObjectID("5ecb60afe730396caab3c785"),
      },
      {
        $set: {
          name: "ROYCE",
        },
        $inc: {
          age: 10,
        },
      },
      {
        returnOriginal: false,
      }
    )
    .then((res) => {
      console.log(JSON.stringify(res, undefined, 2));
    });

  //client.close();
});
