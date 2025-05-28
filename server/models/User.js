const mongoose = require("mongoose");

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  name: { type: String, enum: ["creator", "viewer"], default: "creator" },
});
module.exports = mongoose.model("User", userSchema);
