const mongoose = require("mongoose");
const Tour = require("../models/Tour");
const multer = require("multer");
const path = require("path");

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename with extension
  },
});
const upload = multer({ storage });

// Your existing controllers:

exports.getUserTours = async (req, res) => {
  try {
    const tours = await Tour.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(tours);
  } catch (err) {
    console.error("Error in getUserTours:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!tour) return res.status(404).json({ msg: "Tour not found" });
    res.json(tour);
  } catch (err) {
    console.error("Error in getTourById:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.createTour = async (req, res) => {
  try {
    const { title, description, thumbnail, status, isPublic, steps } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ msg: "Title and description are required" });
    }

    // Sanitize steps - add _id if missing
    const sanitizedSteps = (steps || []).map((step) => ({
      _id: step._id ? step._id : new mongoose.Types.ObjectId(),
      ...step,
    }));

    const newTour = new Tour({
      userId: req.user.id,
      title,
      description,
      thumbnail,
      status: status || "draft",
      isPublic: isPublic || false,
      steps: sanitizedSteps,
    });

    await newTour.save();
    res.status(201).json(newTour);
  } catch (err) {
    console.error("Error in createTour:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const { steps, ...otherFields } = req.body;

    let sanitizedSteps;
    if (steps) {
      sanitizedSteps = steps.map((step) => ({
        _id: step._id ? step._id : new mongoose.Types.ObjectId(),
        ...step,
      }));
    }

    const updateData = { ...otherFields };
    if (sanitizedSteps) {
      updateData.steps = sanitizedSteps;
    }

    const tour = await Tour.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      updateData,
      { new: true }
    );

    if (!tour) return res.status(404).json({ msg: "Tour not found" });

    res.status(200).json(tour);
  } catch (err) {
    console.error("Error in updateTour:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const { id } = req.params;

    const tour = await Tour.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!tour) return res.status(404).json({ msg: "Tour not found" });

    res.status(200).json({ msg: "Tour deleted" });
  } catch (err) {
    console.error("Error in deleteTour:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// NEW: Upload handler middleware
exports.uploadFile = [
  upload.single("file"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }
    const url = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;
    res.json({ url });
  },
];
