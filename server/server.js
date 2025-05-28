const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Authroute = require("./routes/authRoutes");

require("dotentv").config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", Authroute);

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
