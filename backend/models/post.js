const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  imagePath: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ingredients: { type: String, required: true },
  stepContent: {type: String, required: true}
});

module.exports = mongoose.model("Post", postSchema);
