var mongoose = require("mongoose");

//Define a schema
var Schema = mongoose.Schema;

var noteSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    title: String,
    description: String,
    date: String,
  },
  {
    timestamps: true,
  }
);

var Note = mongoose.model("Note", noteSchema);

module.exports = Note;
