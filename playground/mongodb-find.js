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
  // Get the collection
  const collection = client.db("TodoApp").collection("Todos");
  const usersCollection = client.db("TodoApp").collection("Users");

  // collection
  //   .find()
  //   .toArray()
  //   .then(
  //     (docs) => {
  //       console.log(JSON.stringify(docs, undefined, 2));
  //     },
  //     (err) => {
  //       console.log("Unable to fetch todos ", err);
  //     }
  //   );

  // collection
  //   .find({
  //     _id: new ObjectID("5ecb23ace730396caab3b779"),
  //   })
  //   .toArray()
  //   .then(
  //     (doc) => {
  //       // console.log(doc);
  //       console.log(JSON.stringify(doc, undefined, 2));
  //     },
  //     (err) => {
  //       console.log("Unable to fetch todos ", err);
  //     }
  //   );

  //http://mongodb.github.io/node-mongodb-native/3.5/api/Cursor.html#count
  // collection
  //   .find()
  //   .count()
  //   .then(
  //     (count) => {
  //       console.log(`To do count: ${count}`);
  //     },
  //     (err) => {
  //       console.log("Unable to fetch todos ", err);
  //     }
  //   );

  //http://mongodb.github.io/node-mongodb-native/3.5/api/Cursor.html#count
  usersCollection
    .find({
      name: "Royce",
    })
    .count((count) => {
      console.log(count);
    });

  //client.close();
});
