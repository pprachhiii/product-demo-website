const Tour = require("../models/Tour");

exports.getUserTours = async (req, res) => {
  try {
    const tours = await Tour.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(tours);
  } catch (err) {
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
    res.status(500).json({ msg: "Server error" });
  }
};

exports.createTour = async (req, res) => {
  try {
    const { title, description, thumbnail, status, isPublic } = req.body;

    const newTour = new Tour({
      userId: req.user.id,
      title,
      description,
      thumbnail,
      status: status || "draft",
      isPublic: isPublic || false,
    });

    await newTour.save();
    res.status(201).json(newTour);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const tour = await Tour.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      updateData,
      { new: true }
    );

    if (!tour) return res.status(404).json({ msg: "Tour not found" });

    res.status(200).json(tour);
  } catch (err) {
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
    res.status(500).json({ msg: "Server error" });
  }
};
