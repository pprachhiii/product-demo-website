require("dotenv").config();
const mongoose = require("mongoose");
const Tour = require("./models/Tour");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected for seeding");

    // Clear existing data
    await Tour.deleteMany({});

    // Create demo tour with embedded steps
    const demoTour = new Tour({
      userId: null, // or put some valid userId
      title: "Demo Tour",
      description: "This is a demo tour for preview",
      thumbnail: "demo-thumbnail.jpg",
      status: "published",
      isPublic: true,
      steps: [
        {
          title: "Step 1",
          description: "Welcome to step 1",
          image: "step1.jpg",
          annotations: [],
          order: 1,
          duration: 3000,
        },
        {
          title: "Step 2",
          description: "This is step 2",
          image: "step2.jpg",
          annotations: [],
          order: 2,
          duration: 3000,
        },
        {
          title: "Step 3",
          description: "Finally, step 3",
          image: "step3.jpg",
          annotations: [],
          order: 3,
          duration: 3000,
        },
      ],
    });

    await demoTour.save();

    console.log("✅ Demo tour with steps seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
