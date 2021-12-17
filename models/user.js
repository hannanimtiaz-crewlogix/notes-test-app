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

User.find({}).then(function (docs) {
  if (docs.length === 0) {
    console.log("user does not exist creating user");
    User.create({
      firstName: "Hannan",
      lastName: "Imtiaz",
      email: "hannan@email.com",
      phone: 1234567,
      password: "hEllo!23",
      gender: "male",
      dob: "07-09-1994",
    });
  }
});

module.exports = User;
