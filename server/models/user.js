const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

//Schema allow us to customize function
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: (value) => {
        return validator.isEmail(value);
      },
      message: `{VALUE} is not valid email.`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  tokens: [
    {
      access: {
        type: String,
        required: true,
      },
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

//only show partial information for security purpose
UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ["_id", "email"]);
};

//UserSchema.methods are instance methods
//instance methods have access to instance document
UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = "auth";
  var token = jwt
    .sign({ _id: user._id.toHexString(), access }, "abc123")
    .toString();

  user.tokens = user.tokens.concat([{ access, token }]);
  //return a promise
  return user.save().then(() => {
    return token;
  });
};

var User = mongoose.model("User", UserSchema);

// var User = mongoose.model("User", {
//   email: {
//     type: String,
//     required: true,
//     trim: true,
//     minlength: 1,
//     unique: true,
//     validate: {
//       validator: (value) => {
//         return validator.isEmail(value);
//       },
//       message: `{VALUE} is not valid email.`,
//     },
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 6,
//   },
//   tokens: [
//     {
//       access: {
//         type: String,
//         required: true,
//       },
//       token: {
//         type: String,
//         required: true,
//       },
//     },
//   ],
// });

module.exports = {
  User,
};
