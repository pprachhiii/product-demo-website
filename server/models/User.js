const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // You likely need this!
  role: { type: String, enum: ["creator", "viewer"], default: "creator" },
});

module.exports = mongoose.model("User", userSchema);
