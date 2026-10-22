const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    module: {
      type: String,
      required: true
    },
    studentName: {
      type: String,
      required: true,
      trim: true
    },
    studentId: {
      type: String,
      required: true,
      trim: true
    },
    assignmentName: {
      type: String,
      required: true
    },

    assignmentQuestions: {
      type: String,
      required: true
    },

    questionSpecification: {
      type: String,
      default: ""
    },

    markingRubric: {
      type: String,
      required: true
    },

    studentAnswer: {
      type: String,
      required: true
    },

    analysis: {
      strengths: {
        type: [String],
        default: []
      },

      codingErrors: {
        type: [String],
        default: []
      },

      logicalWeaknesses: {
        type: [String],
        default: []
      },

      missingRequirements: {
        type: [String],
        default: []
      },

      improvementSuggestions: {
        type: [String],
        default: []
      }
    },

    // AI-generated rubric marks
    rubricMarks: {
      type: Array,
      default: []
    },

    // AI suggested total
    suggestedTotal: {
      type: Number,
      default: null
    },

    // AI-generated feedback
    personalizedFeedback: {
      type: String,
      default: ""
    },

    // generated = waiting for lecturer review
    // approved = lecturer has approved final result
    status: {
      type: String,
      enum: ["generated", "approved"],
      default: "generated"
    },

    // Lecturer-approved marks
    approvedMarks: {
      type: Array,
      default: []
    },

    // Lecturer-approved feedback
    approvedFeedback: {
      type: String,
      default: ""
    },

    // Additional marks awarded by lecturer
    bonusMarks: {
      type: Number,
      default: 0,
      min: 0
    },

    // Final mark after lecturer review
    finalTotal: {
      type: Number,
      default: null,
      min: 0
    },

    // Lecturer's explanation/comment
    lecturerComment: {
      type: String,
      default: ""
    },

    approvedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Feedback", feedbackSchema);