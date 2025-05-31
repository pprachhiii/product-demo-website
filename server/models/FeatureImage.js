const mongoose = require("mongoose");

const FeatureImageSchema = new mongoose.Schema({
  imageUrl: String,
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FeatureImage", FeatureImageSchema);
