var env = require("./env.json");

var node_env = process.env.NODE_ENV || "development";

console.log("---------------------------");
console.log(node_env);
console.log("---------------------------");

module.exports = env[node_env];
