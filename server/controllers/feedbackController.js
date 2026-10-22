
const Feedback = require("../models/Feedback");
const { analyseAssignment } = require("../services/aiService");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const path = require("path");

// ============================================
// 1. Extract text from an uploaded document
// ============================================
async function extractDocumentText(file) {
  if (!file) return "";

  const extension = path.extname(file.originalname).toLowerCase();

  if (extension === ".pdf") {
    const result = await pdfParse(file.buffer);
    return result.text.trim();
  }

  if (extension === ".docx") {
    const result = await mammoth.extractRawText({
      buffer: file.buffer
    });
    return result.value.trim();
  }

  // Plain text and supported source-code files
  if (
    [".txt", ".py", ".java", ".js", ".cpp", ".c"].includes(
      extension
    )
  ) {
    return file.buffer.toString("utf8").trim();
  }

  throw new Error(`Unsupported document format: ${extension}`);
}

// ============================================
// 2. Combine manual text and uploaded document
// ============================================
async function getCombinedContent(text, file) {
  const manualText =
    typeof text === "string" ? text.trim() : "";

  const documentText = await extractDocumentText(file);

  return [manualText, documentText]
    .filter(Boolean)
    .join("\n\n");
}

// ============================================
// 3. Create feedback
// ============================================
async function createFeedback(req, res) {
  try {
    const {
      module,
      assignmentName,
      assignmentQuestions,
      questionSpecification,
      markingRubric,
      studentAnswer,
      studentName,
      studentId
    } = req.body || {};

    // Each section supports text, a document, or both.
    const questionFile =
      req.files?.questionDocument?.[0] || null;

    const rubricFile =
      req.files?.markingRubricDocument?.[0] || null;

    const answerFile =
      req.files?.studentAnswerDocument?.[0] || null;

    // Extract and combine the provided content.
    const combinedQuestion = await getCombinedContent(
      assignmentQuestions,
      questionFile
    );

    const combinedRubric = await getCombinedContent(
      markingRubric,
      rubricFile
    );

    const combinedAnswer = await getCombinedContent(
      studentAnswer,
      answerFile
    );

    // Validate required information.
    const missingFields = [];

    if (typeof module !== "string" || !module.trim()) {
      missingFields.push("module");
    }

    if (
      typeof assignmentName !== "string" ||
      !assignmentName.trim()
    ) {
      missingFields.push("assignment name");
    }

    if (!combinedQuestion) {
      missingFields.push(
        "assessment question (text or document)"
      );
    }

    if (!combinedRubric) {
      missingFields.push(
        "marking rubric (text or document)"
      );
    }

    if (!combinedAnswer) {
      missingFields.push(
        "student answer (text or document)"
      );
    }

    if (
      typeof studentName !== "string" ||
      !studentName.trim()
    ) {
      missingFields.push("student name");
    }

    if (
      typeof studentId !== "string" ||
      !studentId.trim()
    ) {
      missingFields.push("student ID");
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          `Please provide: ${missingFields.join(", ")}. ` +
          "For each question, rubric, and answer, you can " +
          "enter text, upload a document, or provide both."
      });
    }

    const cleanQuestionSpecification =
      typeof questionSpecification === "string"
        ? questionSpecification.trim()
        : "";

    // Generate the AI analysis.
    const aiResult = await analyseAssignment({
      module: module.trim(),
      assignmentName: assignmentName.trim(),
      assignmentQuestions: combinedQuestion,
      questionSpecification: cleanQuestionSpecification,
      markingRubric: combinedRubric,
      studentAnswer: combinedAnswer
    });

    // Save the feedback and AI results to MongoDB.
    const feedback = await Feedback.create({
      studentName: studentName.trim(),
      studentId: studentId.trim(),
      module: module.trim(),
      assignmentName: assignmentName.trim(),
      assignmentQuestions: combinedQuestion,
      questionSpecification: cleanQuestionSpecification,
      markingRubric: combinedRubric,
      studentAnswer: combinedAnswer,

      analysis: {
        strengths: aiResult.strengths,
        codingErrors: aiResult.codingErrors,
        logicalWeaknesses: aiResult.logicalWeaknesses,
        missingRequirements: aiResult.missingRequirements,
        improvementSuggestions: aiResult.improvementSuggestions
      },

      rubricMarks: aiResult.rubricMarks,
      suggestedTotal: aiResult.suggestedTotal,
      personalizedFeedback: aiResult.personalizedFeedback,
      status: "generated"
    });

    // Return only success details.
    // The frontend can redirect to the feedback history page.
    return res.status(201).json({
      success: true,
      message: "Feedback generated successfully!",
      feedbackId: feedback._id.toString(),
      status: feedback.status
    });
  } catch (error) {
    console.error("Create feedback error:", error);

    if (
      error.message?.startsWith(
        "Unsupported document format:"
      )
    ) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to generate feedback. Please check the uploaded " +
        "documents, backend and AI API configuration.",
      realErrorCause: error.message
    });
  }
}

// ============================================
// 4. Get all feedback records
// ============================================
async function getAllFeedback(req, res) {
  try {
    const feedbackRecords = await Feedback.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: feedbackRecords.length,
      data: feedbackRecords
    });
  } catch (error) {
    console.error("Get all feedback error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve feedback records"
    });
  }
}

// ============================================
// 5. Get one feedback record by ID
// ============================================
async function getFeedback(req, res) {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        message: "Feedback record not found"
      });
    }

    return res.status(200).json(feedback);
  } catch (error) {
    console.error("Get feedback error:", error.message);

    return res.status(400).json({
      message: "Invalid feedback ID"
    });
  }
}

// ============================================
// 6. Lecturer approves feedback and marks
// ============================================
async function approveFeedback(req, res) {
  try {
    const {
      approvedFeedback,
      approvedMarks,
      bonusMarks,
      lecturerComment
    } = req.body || {};

    if (
      typeof approvedFeedback !== "string" ||
      !approvedFeedback.trim()
    ) {
      return res.status(400).json({
        message: "Approved feedback text is required"
      });
    }

    if (!Array.isArray(approvedMarks)) {
      return res.status(400).json({
        message: "Approved marks must be provided as an array"
      });
    }

    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        message: "Feedback record not found"
      });
    }

    // Validate each marking criterion.
    for (const mark of approvedMarks) {
      if (
        typeof mark.criterion !== "string" ||
        typeof mark.maximumMarks !== "number" ||
        typeof mark.finalMarks !== "number"
      ) {
        return res.status(400).json({
          message:
            "Each approved mark must contain criterion, " +
            "maximumMarks and finalMarks"
        });
      }

      if (
        mark.maximumMarks < 0 ||
        mark.finalMarks < 0 ||
        mark.finalMarks > mark.maximumMarks
      ) {
        return res.status(400).json({
          message:
            `Invalid final mark for criterion: ${mark.criterion}`
        });
      }
    }

    const lecturerMarksTotal = approvedMarks.reduce(
      (total, mark) => total + mark.finalMarks,
      0
    );

    const parsedBonusMarks =
      bonusMarks === undefined || bonusMarks === null
        ? 0
        : Number(bonusMarks);

    if (
      !Number.isFinite(parsedBonusMarks) ||
      parsedBonusMarks < 0
    ) {
      return res.status(400).json({
        message:
          "Bonus marks must be a valid non-negative number"
      });
    }

    const finalTotal =
      lecturerMarksTotal + parsedBonusMarks;

    feedback.approvedFeedback = approvedFeedback.trim();
    feedback.approvedMarks = approvedMarks;
    feedback.bonusMarks = parsedBonusMarks;
    feedback.finalTotal = finalTotal;

    feedback.lecturerComment =
      typeof lecturerComment === "string"
        ? lecturerComment.trim()
        : "";

    feedback.status = "approved";
    feedback.approvedAt = new Date();

    await feedback.save();

    return res.status(200).json({
      message: "Feedback approved successfully",
      feedbackId: feedback._id.toString(),
      result: {
        aiSuggestedTotal: feedback.suggestedTotal,
        approvedMarks: feedback.approvedMarks,
        lecturerMarksTotal,
        bonusMarks: feedback.bonusMarks,
        finalTotal: feedback.finalTotal,
        approvedFeedback: feedback.approvedFeedback,
        lecturerComment: feedback.lecturerComment,
        status: feedback.status,
        approvedAt: feedback.approvedAt
      }
    });
  } catch (error) {
    console.error("Approve feedback error:", error.message);

    return res.status(500).json({
      message: "Unable to approve feedback"
    });
  }
}

// ============================================
// 7. Delete one feedback record by ID
// ============================================
async function deleteFeedback(req, res) {
  try {
    const feedback = await Feedback.findByIdAndDelete(
      req.params.id
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback record not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Feedback record deleted successfully",
      feedbackId: feedback._id.toString()
    });
  } catch (error) {
    console.error("Delete feedback error:", error.message);

    return res.status(400).json({
      success: false,
      message: "Invalid feedback ID"
    });
  }
}

// ============================================
// 8. Export controller functions
// ============================================
module.exports = {
  createFeedback,
  getAllFeedback,
  getFeedback,
  approveFeedback,
  deleteFeedback
};
