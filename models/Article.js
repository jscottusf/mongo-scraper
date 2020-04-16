const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  link: {
    type: String,
    required: true,
    unique: true,
  },
  teaser: {
    type: String,
    required: true,
    unique: true,
  },
  topic: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
    unique: true,
  },
  //show if articles are favorited or not
  favorite: {
    type: Boolean,
    default: false,
  },
  //comment in array allows mulitple comments to be pushed in
  //display number of notes with note.length
  note: [
    {
      type: Schema.Types.ObjectId,
      ref: "Note",
    },
  ],
});

let Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
