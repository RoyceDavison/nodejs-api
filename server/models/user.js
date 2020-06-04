const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

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
      //message: `{VALUE} is not valid email.`,
      message: `It is not valid email.`,
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
    .sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET)
    .toString();

  user.tokens = user.tokens.concat([{ access, token }]);
  //return a promise
  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = function (token) {
  //remove an item from the array that matches the criteria
  var user = this;

  return user.update({
    $pull: {
      //In here, we will remove the object in the tokens array
      tokens: {
        token: token,
      },
    },
  });
};

//model method, not instance method, so you can call it by className
UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject();
  }

  return User.findOne({
    _id: decoded._id,
    //to query a nested document
    "tokens.token": token,
    "tokens.access": "auth",
  });
};

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;
  return User.findOne({ email }).then((user) => {
    if (!user) return Promise.reject();
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, function (err, res) {
        if (res) resolve(user);
        else reject();
      });
    });
  });
};

//middleware which is used to store the hashed password
UserSchema.pre("save", function (next) {
  var user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

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
