const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Authroute = require("./routes/authRoute");
const tourRoute = require("./routes/toursRoute");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api/auth", Authroute);
app.use("/api/tours", tourRoute);

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
