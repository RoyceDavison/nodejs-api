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
