const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const authRoutes = require("./routes/authRoutes");
const tourRoutes = require("./routes/tourRoutes");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve uploads folder statically
app.use("/uploads", express.static(uploadsDir));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Register API routes
app.use("/api/auth", authRoutes);
app.use("/api/tours", tourRoutes);

// Serve React frontend build (adjust if needed)
app.use(express.static(path.join(__dirname, "client/build")));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Something went wrong" });
});

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}
main()
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
