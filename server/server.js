
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env")
});

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const feedbackRoutes = require("./routes/feedbackRoutes");

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
  })
);

// Parse JSON request bodies
app.use(express.json({ limit: "1mb" }));

// Accept optional attachments in FormData.
// Files are held in memory and are not stored permanently.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 2
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Academic Feedback API is running"
  });
});

// Health-check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected"
  });
});

// Feedback API routes
app.use(
  "/api/feedback",
  upload.fields([
    { name: "questionDocument", maxCount: 1 },
    { name: "studentAnswerDocument", maxCount: 1 }
  ]),
  feedbackRoutes
);

// Start server after connecting to MongoDB
const PORT = process.env.PORT || 7000;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Backend running at http://localhost:${PORT}`);
      console.log("MongoDB connection established.");
      console.log("Health endpoint: http://localhost:7000/api/health");
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
