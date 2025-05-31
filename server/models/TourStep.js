const mongoose = require("mongoose");

const TourStepSchema = new mongoose.Schema({
  tourId: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true },
  title: String,
  description: String,
  image: String,
  annotations: { type: Array, default: [] },
  order: Number,
});

module.exports = mongoose.model("TourStep", TourStepSchema);
