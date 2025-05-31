const express = require("express");
const router = express.Router();
const tourStepController = require("../controllers/tourStepController");
const auth = require("../middleware/auth");

// Create a step for a specific tour
router.post("/tours/:tourId/steps", auth, tourStepController.createStep);

// Get all steps for a specific tour
router.get("/tours/:tourId/steps", auth, tourStepController.getStepsForTour);

// Update a step by step ID
router.put("/steps/:stepId", auth, tourStepController.updateStep);

// Delete a step by step ID
router.delete("/steps/:stepId", auth, tourStepController.deleteStep);

module.exports = router;
