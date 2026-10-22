
const express = require("express");

const router = express.Router();

const {
  createFeedback,
  getFeedback,
  approveFeedback,
  getAllFeedback,
  deleteFeedback,
} = require("../controllers/feedbackController");

const uploadFeedbackFiles = require("../middleware/uploadMiddleware");

// Generate AI feedback with optional document uploads
router.post(
  "/",
  uploadFeedbackFiles,
  createFeedback
);

// Get all feedback records
router.get("/", getAllFeedback);

// Get one feedback record
router.get("/:id", getFeedback);

// Lecturer edits marks/feedback and approves
router.put("/:id/approve", approveFeedback);

// Delete one feedback record
router.delete("/:id", deleteFeedback);

module.exports = router;
