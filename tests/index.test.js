process.env["NODE_ENV"] = "development";

var mongoose = require("mongoose");
var config = require("../config/config");

var mongoDB = config.mongo_path;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var connection = mongoose.createConnection(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const bin = require("../bin/www");

require("./note.test");
