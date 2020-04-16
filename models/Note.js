const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let NoteSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: false,
  },
  body: {
    type: String,
    time: true,
    required: true,
  },
});

NoteSchema.methods.checkName = function () {
  if (this.name === "") {
    this.name = "Anonymous";
  }
  return this.name;
};

let Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
