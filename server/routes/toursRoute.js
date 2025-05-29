const express = require("express");
const router = express.Router();
const Tour = require("../models/Tour");
// const authMiddleware = require("../middleware/auth");

// Create new tour (protected route)
// router.post("/", authMiddleware, async (req, res) => {
//   const { title, steps } = req.body;
//   try {
//     const tour = new Tour({ title, steps, owner: req.user.id });
//     await tour.save();
//     res.status(201).json(tour);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Get all tours of logged in user
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const tours = await Tour.find({ owner: req.user.id });
//     res.json(tours);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

module.exports = router;
