const TourStep = require("../models/TourStep");

exports.getStepsForTour = async (req, res) => {
  try {
    const steps = await TourStep.find({ tourId: req.params.tourId }).sort({
      order: 1,
    });
    res.status(200).json(steps);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch steps" });
  }
};

exports.createStep = async (req, res) => {
  try {
    const { tourId } = req.params;
    const { title, description, image, annotations, order } = req.body;

    const newStep = new TourStep({
      tourId,
      title,
      description,
      image,
      annotations: annotations || [],
      order,
    });

    await newStep.save();
    res.status(201).json(newStep);
  } catch (err) {
    res.status(500).json({ msg: "Failed to create step" });
  }
};

exports.updateStep = async (req, res) => {
  try {
    const step = await TourStep.findByIdAndUpdate(req.params.stepId, req.body, {
      new: true,
    });
    if (!step) return res.status(404).json({ msg: "Step not found" });
    res.json(step);
  } catch (err) {
    res.status(500).json({ msg: "Failed to update step" });
  }
};

exports.deleteStep = async (req, res) => {
  try {
    const step = await TourStep.findByIdAndDelete(req.params.stepId);
    if (!step) return res.status(404).json({ msg: "Step not found" });
    res.json({ msg: "Step deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete step" });
  }
};
