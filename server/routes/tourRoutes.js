const express = require("express");
const router = express.Router();
const tourController = require("../controllers/tourController");
const auth = require("../middleware/auth");

router.get("/", auth, tourController.getUserTours); // GET all tours for user
router.get("/:id", auth, tourController.getTourById); // GET specific tour by ID
router.post("/", auth, tourController.createTour); // CREATE new tour
router.put("/:id", auth, tourController.updateTour); // UPDATE tour metadata
router.delete("/:id", auth, tourController.deleteTour); // DELETE tour

module.exports = router;
