var env = process.env.NODE_ENV || "development"; //env(production, test, development) is used to link different databases
// console.log("env *******", env);

//production version will not pass through
//production version config setup terminal command: heroku config set JWT_SECRET=sdfkaj123asd
if (env === "development" || env === "test") {
  var config = require("./config.json");
  var envConfig = config[env];
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}

// if (env === "development") {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = "mongodb://localhost:27017/TodoApp";
// } else if (env === "test") {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = "mongodb://localhost:27017/TodoAppTest";
// }
