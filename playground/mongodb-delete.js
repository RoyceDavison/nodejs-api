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

  // //deleteMany()
  // todoCollection.deleteMany({ text: "eat lunch" }).then((res) => {
  //   console.log(res);
  // });

  //deleteOne()
  // todoCollection.deleteOne({ text: "eat lunch" }).then((res) => {
  //   console.log(res);
  // });

  //findOneAndDelete()
  // todoCollection.findOneAndDelete({ text: "eat lunch" }).then((doc) => {
  //   console.log(doc);
  // });

  const usersCollection = client.db("TodoApp").collection("Users");
  usersCollection
    .findOneAndDelete({ _id: new ObjectID("5ecb221d8413a86d2fb56f34") })
    .then(
      (doc) => {
        console.log(JSON.stringify(doc, undefined, 2));
      },
      (err) => {
        console.log(err);
      }
    );

  //client.close();
});
