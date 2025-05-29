const mongoose = require("mongoose");
const { Schema } = mongoose;

const stepSchema = new Schema({
  image: String,
  description: String,
});

const tourSchema = new Schema(
  {
    title: { type: String, required: true },
    steps: [stepSchema],
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tour", tourSchema);
