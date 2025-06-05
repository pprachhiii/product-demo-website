const mongoose = require("mongoose");

const TourSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  description: String,
  thumbnail: String,
  views: { type: Number, default: 0 },
  status: { type: String, enum: ["published", "draft"], default: "draft" },
  isPublic: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  steps: [
    {
      title: String,
      description: String,
      image: String,
      annotations: { type: Array, default: [] },
      order: Number,
      duration: { type: Number, default: 3000 },
    },
  ],
});
module.exports = mongoose.model("Tour", TourSchema);
