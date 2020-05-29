var mongoose = require("mongoose");
var { ObjectID } = require("mongodb");
//Tell the mongoose to use default Promise library, not 3-rd party library
mongoose.Promise = global.Promise;
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

mongoose.connect("mongodb://localhost:27017/TodoApp");

//heroku addons:create mongolab:sandbox
//heroku config
// mongoose.connect(MONGODB_URI || "mongodb://localhost:27017/TodoApp");

module.exports = {
  mongoose,
  ObjectID,
};
