var mongoose = require("mongoose");

//Define a schema
var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    phone: Number,
    password: String,
    gender: String,
    dob: String,
  },
  {
    timestamps: true,
  }
);

var User = mongoose.model("User", userSchema);

module.exports = User;
