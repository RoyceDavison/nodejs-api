/**
 *  Hashing &&&  JSON Web Token (JWT)
 *
 */
const { SHA256 } = require("crypto-js");
const jwt = require("jsonwebtoken");

var data = {
  id: 10,
};

var token = jwt.sign(data, "mySecret");
var decoded = jwt.verify(token, "mySecret");
console.log(decoded);

// var message = "I am the number 3";
// var hash = SHA256(message).toString();
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
//   id: 4,
// };

// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + "somesecret").toString(),
// };

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(data) + "somesecret").toString();
// if (resultHash === token.hash) {
//   console.log("Good");
// } else {
//   console.log("Bad");
// }

/**
 *  Hashing Password
 *
 */
const bcrypt = require("bcryptjs");
var password = "123abc!";

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

var hashPassword =
  "$2a$10$8wloTOFcXLuzvnND25bKpeCUj5MHKvSO/0HzGnOpqijdoOY7GJ2W6";

bcrypt.compare(password, hashPassword, (err, res) => {
  console.log(res);
});
