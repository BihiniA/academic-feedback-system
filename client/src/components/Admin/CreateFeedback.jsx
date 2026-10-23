import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateFeedback = () => {
  const navigate = useNavigate();
  // ============================================================
  // FORM DATA
  // ============================================================

  const [formData, setFormData] = useState({
    module: "",
    assignmentName: "",
    studentName: "",
    studentId: "",
    assignmentQuestions: "",
    questionSpecification: "",
    markingRubric: "",
    studentAnswer: "",
  });

  // ============================================================
  // UI STATES
  // ============================================================

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Complete backend feedback document
  const [aiFeedback, setAiFeedback] = useState(null);

  // Lecturer editing state
  const [isEditing, setIsEditing] = useState(false);

  // Editable AI-generated content
  const [editableFeedback, setEditableFeedback] = useState({
    strengths: "",
    codingErrors: "",
    logicalWeaknesses: "",
    missingRequirements: "",
    improvementSuggestions: "",
    personalizedFeedback: "",
    suggestedTotal: "",
  });

  // ============================================================
  // FORM HANDLERS
  // ============================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrorMessage("");
  };

  // ============================================================
  // FORMAT AI VALUES
  // ============================================================

  const formatAIValue = (value) => {
    if (value === null || value === undefined) {
      return "";
    }

    if (Array.isArray(value)) {
      return value
        .map((item) => {
          if (typeof item === "object" && item !== null) {
            return JSON.stringify(item, null, 2);
          }

          return String(item);
        })
        .join("\n");
    }

    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }

    return String(value);
  };

  // ============================================================
  // EXTRACT BACKEND RESPONSE
  // ============================================================

  const extractFeedbackData = (result) => {
    console.log("======================================");
    console.log("FULL BACKEND RESPONSE");
    console.log(result);
    console.log("======================================");

    // ----------------------------------------------------------
    // CASE 1
    //
    // Direct backend response:
    //
    // {
    //   analysis: {...},
    //   rubricMarks: [...],
    //   suggestedTotal: 5,
    //   personalizedFeedback: "..."
    // }
    // ----------------------------------------------------------

    if (
      result &&
      result.analysis &&
      typeof result.analysis === "object"
    ) {
      return result;
    }

    // ----------------------------------------------------------
    // CASE 2
    //
    // {
    //   feedback: {
    //      analysis: {...}
    //   }
    // }
    // ----------------------------------------------------------

    if (
      result &&
      result.feedback &&
      result.feedback.analysis
    ) {
      return result.feedback;
    }

    // ----------------------------------------------------------
    // CASE 3
    //
    // {
    //   data: {
    //      analysis: {...}
    //   }
    // }
    // ----------------------------------------------------------

    if (
      result &&
      result.data &&
      result.data.analysis
    ) {
      return result.data;
    }

    // ----------------------------------------------------------
    // CASE 4
    //
    // {
    //   result: {
    //      analysis: {...}
    //   }
    // }
    // ----------------------------------------------------------

    if (
      result &&
      result.result &&
      result.result.analysis
    ) {
      return result.result;
    }

    // ----------------------------------------------------------
    // CASE 5
    //
    // Recursively search for an object containing analysis
    // ----------------------------------------------------------

    const recursiveSearch = (object) => {
      if (
        !object ||
        typeof object !== "object"
      ) {
        return null;
      }

      if (
        object.analysis &&
        typeof object.analysis === "object"
      ) {
        return object;
      }

      for (const key of Object.keys(object)) {
        const value = object[key];

        if (
          value &&
          typeof value === "object"
        ) {
          const found = recursiveSearch(value);

          if (found) {
            return found;
          }
        }
      }

      return null;
    };

    const found = recursiveSearch(result);

    if (found) {
      return found;
    }

    // Last fallback
    return result;
  };

  // ============================================================
  // GENERATE AI FEEDBACK
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setAiFeedback(null);
    setIsEditing(false);

    // ----------------------------------------------------------
    // VALIDATION
    // ----------------------------------------------------------

    if (!formData.module.trim()) {
      setErrorMessage("Please select a module.");
      return;
    }

    if (!formData.assignmentName.trim()) {
      setErrorMessage("Please enter the assignment name.");
      return;
    }

    if (!formData.studentName.trim()) {
      setErrorMessage("Please enter the student's name.");
      return;
    }

    if (!formData.studentId.trim()) {
      setErrorMessage("Please enter the student's ID.");
      return;
    }

    if (!formData.assignmentQuestions.trim()) {
      setErrorMessage("Please enter the assignment questions.");
      return;
    }

    if (!formData.markingRubric.trim()) {
      setErrorMessage("Please enter the marking rubric.");
      return;
    }

    if (!formData.studentAnswer.trim()) {
      setErrorMessage("Please enter the student's answer or programming code.");
      return;
    }

    // ----------------------------------------------------------
    // START LOADING
    // ----------------------------------------------------------

    setIsSubmitting(true);

    try {
      // Send all feedback details as regular text in JSON format.
      const response = await fetch(
        "http://localhost:7000/api/feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      // --------------------------------------------------------
      // READ RESPONSE SAFELY
      // --------------------------------------------------------

      const responseText = await response.text();
      let result = {};

      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        // Some backend errors (for example, Multer errors) may
        // return HTML or plain text instead of JSON.
        result = {
          message: responseText || "The server returned an empty response.",
        };
      }

      console.log("API RESPONSE STATUS:", response.status);
      console.log("API RESPONSE:", result);

      // --------------------------------------------------------
      // HANDLE BACKEND ERROR
      // --------------------------------------------------------

      if (!response.ok) {
        const serverMessage =
          result.message || result.error || result.err ||
          (typeof result === "string" ? result : "");

        // Avoid showing a full HTML error page in the form.
        const readableMessage = String(serverMessage)
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim();

        throw new Error(
          readableMessage ||
            `Request failed with status ${response.status}. Please check the backend terminal.`
        );
      }

      // --------------------------------------------------------
      // SUCCESS MESSAGE AND REDIRECT
      // --------------------------------------------------------

      const successMessage =
        result.message || "Feedback created successfully!";

      // Show immediate confirmation so the user can see that the
      // API request succeeded before the history page opens.
      window.alert(successMessage);

      navigate("/history", {
        state: {
          successMessage,
        },
      });
    } catch (error) {
      console.error(
        "Error generating AI feedback:",
        error
      );

      setErrorMessage(
        error.message ||
          "Unable to generate feedback. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // EDIT HANDLER
  // ============================================================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditableFeedback((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ============================================================
  // SAVE FRONTEND EDITS
  // ============================================================

  const handleSaveEdits = () => {
    setIsEditing(false);

    alert(
      "Edits updated successfully on this page."
    );
  };

  // ============================================================
  // APPROVE
  // ============================================================

  const handleApprove = () => {
    /*
      IMPORTANT:

      This currently updates the frontend only.

      We should connect this button to your actual
      MongoDB approval endpoint after confirming the
      backend route/controller.
    */

    setIsEditing(false);

    setAiFeedback((previous) => ({
      ...previous,

      approvedFeedback:
        editableFeedback.personalizedFeedback,

      approvedSuggestedTotal:
        editableFeedback.suggestedTotal,

      frontendApprovalStatus:
        "approved",
    }));

    alert(
      "Feedback approved on the frontend."
    );
  };

  // ============================================================
  // GENERATE AGAIN
  // ============================================================

  const handleGenerateAgain = () => {
    setAiFeedback(null);
    setIsEditing(false);
    setErrorMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ============================================================
  // GET RUBRIC MARKS
  // ============================================================

  const rubricMarks =
    Array.isArray(
      aiFeedback?.rubricMarks
    )
      ? aiFeedback.rubricMarks
      : [];

  // ============================================================
  // GET APPROVED MARKS
  // ============================================================

  const approvedMarks =
    Array.isArray(
      aiFeedback?.approvedMarks
    )
      ? aiFeedback.approvedMarks
      : [];

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 overflow-x-hidden">
      <div className="w-full max-w-6xl mx-auto">

        {/* ======================================================
            HEADER
        ======================================================= */}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h1 className="text-3xl font-bold text-indigo-700 mb-2">
                Create New Feedback
              </h1>

              <p className="text-gray-600">
                Generate AI-assisted academic feedback and
                suggested marks for lecturer review.
              </p>
            </div>

            {aiFeedback && (
              <div>
                <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                  AI Analysis Complete
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================
            ERROR MESSAGE
        ======================================================= */}

        {errorMessage && (
          <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg p-4 mb-6">

            <p className="font-semibold mb-1">
              Error
            </p>

            <p>
              {errorMessage}
            </p>
          </div>
        )}

        {/* ======================================================
            INPUT FORM
        ======================================================= */}

        {!aiFeedback && (
          <form
            onSubmit={handleSubmit}
            className="bg-white border-2 border-indigo-200 rounded-lg shadow-md p-6"
          >

            {/* --------------------------------------------------
                MODULE
            --------------------------------------------------- */}

            <div className="mb-5">

              <label
                htmlFor="module"
                className="block text-gray-700 font-semibold mb-2"
              >
                Module
              </label>

              <select
                id="module"
                name="module"
                value={formData.module}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >

                <option value="">
                  Select Module
                </option>

                <option value="Machine Learning">
                  Machine Learning
                </option>

                <option value="Neural Networks and Deep Learning">
                  Neural Networks and Deep Learning
                </option>

                <option value="Enterprise Technology and IT">
                  Enterprise Technology and IT
                </option>

                <option value="Software Engineering">
                  Software Engineering
                </option>

                <option value="Database Systems">
                  Database Systems
                </option>

              </select>
            </div>

            {/* --------------------------------------------------
                ASSIGNMENT NAME
            --------------------------------------------------- */}

            <div className="mb-5">

              <label
                htmlFor="assignmentName"
                className="block text-gray-700 font-semibold mb-2"
              >
                Assignment Name
              </label>

              <input
                type="text"
                id="assignmentName"
                name="assignmentName"
                value={formData.assignmentName}
                onChange={handleChange}
                placeholder="e.g. Assignment 01 - Neural Networks"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />

            </div>

            {/* --------------------------------------------------
                STUDENT DETAILS
            --------------------------------------------------- */}

            <div className="mb-5">
              <label htmlFor="studentName" className="block text-gray-700 font-semibold mb-2">
                Student Name
              </label>
              <input
                type="text"
                id="studentName"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                placeholder="Enter the student's full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="mb-5">
              <label htmlFor="studentId" className="block text-gray-700 font-semibold mb-2">
                Student ID
              </label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="Enter the student's ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* --------------------------------------------------
                ASSIGNMENT QUESTIONS
            --------------------------------------------------- */}

            <div className="mb-5">

              <label
                htmlFor="assignmentQuestions"
                className="block text-gray-700 font-semibold mb-2"
              >
                Assignment Questions
              </label>

              <textarea
                id="assignmentQuestions"
                name="assignmentQuestions"
                value={formData.assignmentQuestions}
                onChange={handleChange}
                rows={7}
                placeholder="Type or paste the assignment questions here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />

            </div>

            {/* --------------------------------------------------
                QUESTION SPECIFICATION
            --------------------------------------------------- */}

            <div className="mb-5">

              <label
                htmlFor="questionSpecification"
                className="block text-gray-700 font-semibold mb-2"
              >
                Question Specification

                <span className="text-gray-500 font-normal ml-2">
                  (Optional)
                </span>
              </label>

              <textarea
                id="questionSpecification"
                name="questionSpecification"
                value={
                  formData.questionSpecification
                }
                onChange={handleChange}
                rows={4}
                placeholder="Enter specific requirements, instructions, constraints, or expectations..."
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />

            </div>

            {/* --------------------------------------------------
                MARKING RUBRIC
            --------------------------------------------------- */}

            <div className="mb-5">

              <label
                htmlFor="markingRubric"
                className="block text-gray-700 font-semibold mb-2"
              >
                Marking Rubric

                <span className="text-gray-500 font-normal ml-2">
                  (Required)
                </span>
              </label>

              <textarea
                id="markingRubric"
                name="markingRubric"
                value={formData.markingRubric}
                onChange={handleChange}
                rows={5}
                placeholder="Enter marking criteria or rubric..."
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />

            </div>

            {/* --------------------------------------------------
                STUDENT ANSWER
            --------------------------------------------------- */}

            <div className="mb-5">

              <label
                htmlFor="studentAnswer"
                className="block text-gray-700 font-semibold mb-2"
              >
                Student Answer / Programming Code
              </label>

              <textarea
                id="studentAnswer"
                name="studentAnswer"
                value={formData.studentAnswer}
                onChange={handleChange}
                rows={12}
                placeholder="Type or paste the student's answer or programming code here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono text-sm"
              />

            </div>

            {/* --------------------------------------------------
                GENERATE BUTTON
            --------------------------------------------------- */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Analyzing Assignment..."
                : "Generate AI Feedback"}
            </button>

            <p className="text-center text-sm text-gray-500 mt-3">
              AI-generated feedback and marks will be reviewed
              by the lecturer before approval.
            </p>

          </form>
        )}

        {/* ======================================================
            AI RESULTS
        ======================================================= */}

        {aiFeedback && (
          <div
            id="ai-feedback-result"
            className="space-y-6"
          >

            {/* ==================================================
                RESULT HEADER
            =================================================== */}

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-600">

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                <div className="min-w-0">

                  <h2 className="text-2xl font-bold text-gray-800">
                    AI-Generated Feedback
                  </h2>

                  <p className="text-gray-600 mt-1">
                    Review the AI analysis before approving
                    the final feedback.
                  </p>

                  {aiFeedback.module && (
                    <p className="text-sm text-gray-500 mt-4">
                      <span className="font-semibold">
                        Module:
                      </span>{" "}
                      {aiFeedback.module}
                    </p>
                  )}

                  {aiFeedback.assignmentName && (
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">
                        Assignment:
                      </span>{" "}
                      {aiFeedback.assignmentName}
                    </p>
                  )}

                </div>

                <div className="bg-indigo-50 px-6 py-4 rounded-lg text-center min-w-[170px] flex-shrink-0">

                  <p className="text-sm text-gray-600">
                    Suggested Total
                  </p>

                  <p className="text-4xl font-bold text-indigo-700">
                    {editableFeedback.suggestedTotal ||
                      "—"}
                  </p>

                </div>

              </div>
            </div>

            {/* ==================================================
                LECTURER REVIEW NOTICE
            =================================================== */}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 overflow-hidden">

              <p className="font-semibold text-yellow-800 text-lg">
                Lecturer Review Required
              </p>

              <p className="text-sm text-yellow-700 mt-2 leading-relaxed">
                The feedback and marks below were generated by
                AI. Please review and edit them where necessary
                before approving the final result.
              </p>

            </div>

            {/* ==================================================
                STRENGTHS
            =================================================== */}

            <div className="bg-white rounded-lg shadow-md p-6">

              <h3 className="text-xl font-bold text-green-700 mb-5">
                Strengths
              </h3>

              {isEditing ? (
                <textarea
                  name="strengths"
                  value={
                    editableFeedback.strengths
                  }
                  onChange={handleEditChange}
                  rows={7}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              ) : (
                <div className="space-y-3">

                  {Array.isArray(
                    aiFeedback?.analysis?.strengths
                  ) &&
                  aiFeedback.analysis.strengths
                    .length > 0 ? (

                    aiFeedback.analysis.strengths.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3"
                        >

                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                            ✓
                          </span>

                          <p className="text-gray-700 leading-relaxed pt-1">
                            {item}
                          </p>

                        </div>
                      )
                    )

                  ) : (

                    <p className="text-gray-500">
                      No strengths identified.
                    </p>

                  )}

                </div>
              )}

            </div>

            {/* ==================================================
                CODING ERRORS
            =================================================== */}

            <div className="bg-white rounded-lg shadow-md p-6">

              <h3 className="text-xl font-bold text-red-600 mb-5">
                Coding Errors
              </h3>

              {isEditing ? (
                <textarea
                  name="codingErrors"
                  value={
                    editableFeedback.codingErrors
                  }
                  onChange={handleEditChange}
                  rows={7}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              ) : (
                <div className="space-y-3">

                  {Array.isArray(
                    aiFeedback?.analysis?.codingErrors
                  ) &&
                  aiFeedback.analysis.codingErrors
                    .length > 0 ? (

                    aiFeedback.analysis.codingErrors.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3"
                        >

                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold">
                            !
                          </span>

                          <p className="text-gray-700 leading-relaxed pt-1">
                            {item}
                          </p>

                        </div>
                      )
                    )

                  ) : (

                    <p className="text-gray-500">
                      No coding errors identified.
                    </p>

                  )}

                </div>
              )}

            </div>

            {/* ==================================================
                LOGICAL WEAKNESSES
            =================================================== */}

            <div className="bg-white rounded-lg shadow-md p-6">

              <h3 className="text-xl font-bold text-orange-600 mb-5">
                Logical Weaknesses
              </h3>

              {isEditing ? (
                <textarea
                  name="logicalWeaknesses"
                  value={
                    editableFeedback.logicalWeaknesses
                  }
                  onChange={handleEditChange}
                  rows={7}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              ) : (
                <div className="space-y-3">

                  {Array.isArray(
                    aiFeedback?.analysis?.logicalWeaknesses
                  ) &&
                  aiFeedback.analysis.logicalWeaknesses
                    .length > 0 ? (

                    aiFeedback.analysis.logicalWeaknesses.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3"
                        >

                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                            !
                          </span>

                          <p className="text-gray-700 leading-relaxed pt-1">
                            {item}
                          </p>

                        </div>
                      )
                    )

                  ) : (

                    <p className="text-gray-500">
                      No logical weaknesses identified.
                    </p>

                  )}

                </div>
              )}

            </div>

            {/* ==================================================
                MISSING REQUIREMENTS
            =================================================== */}

            <div className="bg-white rounded-lg shadow-md p-6">

              <h3 className="text-xl font-bold text-purple-700 mb-5">
                Missing Requirements
              </h3>

              {isEditing ? (
                <textarea
                  name="missingRequirements"
                  value={
                    editableFeedback.missingRequirements
                  }
                  onChange={handleEditChange}
                  rows={7}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              ) : (
                <div className="space-y-3">

                  {Array.isArray(
                    aiFeedback?.analysis?.missingRequirements
                  ) &&
                  aiFeedback.analysis
                    .missingRequirements.length > 0 ? (

                    aiFeedback.analysis.missingRequirements.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3"
                        >

                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                            •
                          </span>

                          <p className="text-gray-700 leading-relaxed pt-1">
                            {item}
                          </p>

                        </div>
                      )
                    )

                  ) : (

                    <p className="text-gray-500">
                      No missing requirements identified.
                    </p>

                  )}

                </div>
              )}

            </div>

            {/* ==================================================
                IMPROVEMENT SUGGESTIONS
            =================================================== */}

            <div className="bg-white rounded-lg shadow-md p-6">

              <h3 className="text-xl font-bold text-blue-700 mb-5">
                Improvement Suggestions
              </h3>

              {isEditing ? (
                <textarea
                  name="improvementSuggestions"
                  value={
                    editableFeedback.improvementSuggestions
                  }
                  onChange={handleEditChange}
                  rows={7}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              ) : (
                <div className="space-y-3">

                  {Array.isArray(
                    aiFeedback?.analysis?.improvementSuggestions
                  ) &&
                  aiFeedback.analysis
                    .improvementSuggestions.length > 0 ? (

                    aiFeedback.analysis.improvementSuggestions.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3"
                        >

                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                            →
                          </span>

                          <p className="text-gray-700 leading-relaxed pt-1">
                            {item}
                          </p>

                        </div>
                      )
                    )

                  ) : (

                    <p className="text-gray-500">
                      No improvement suggestions available.
                    </p>

                  )}

                </div>
              )}

            </div>

            {/* ==================================================
                RUBRIC MARKS
            =================================================== */}

            <div className="bg-white rounded-lg shadow-md p-6">

              <h3 className="text-xl font-bold text-indigo-700 mb-5">
                Rubric-Based Marks
              </h3>

              {rubricMarks.length > 0 ? (

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[700px] border-collapse">

                    <thead>
                      <tr className="bg-indigo-50">

                        <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                          Criterion
                        </th>

                        <th className="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">
                          Maximum Marks
                        </th>

                        <th className="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">
                          Suggested Marks
                        </th>

                        <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                          Reason
                        </th>

                      </tr>
                    </thead>

                    <tbody>

                      {rubricMarks.map(
                        (item, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-50"
                          >

                            <td className="border border-gray-200 px-4 py-3 font-semibold text-gray-800">
                              {item?.criterion ||
                                "—"}
                            </td>

                            <td className="border border-gray-200 px-4 py-3 text-center">
                              {item?.maximumMarks ??
                                "—"}
                            </td>

                            <td className="border border-gray-200 px-4 py-3 text-center">

                              <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-bold">
                                {item?.suggestedMarks ??
                                  "—"}
                              </span>

                            </td>

                            <td className="border border-gray-200 px-4 py-3 text-gray-700">
                              {item?.reason ||
                                "No reason provided."}
                            </td>

                          </tr>
                        )
                      )}

                    </tbody>

                  </table>

                </div>

              ) : (

                <div className="bg-gray-50 rounded-lg p-5">
                  <p className="text-gray-500">
                    No rubric marks were returned by the AI.
                  </p>
                </div>

              )}

            </div>

            {/* ==================================================
                PERSONALIZED FEEDBACK
            =================================================== */}

            <div className="bg-white rounded-lg shadow-md p-6">

              <h3 className="text-xl font-bold text-indigo-700 mb-5">
                Personalized Academic Feedback
              </h3>

              {isEditing ? (

                <textarea
                  name="personalizedFeedback"
                  value={
                    editableFeedback.personalizedFeedback
                  }
                  onChange={handleEditChange}
                  rows={9}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />

              ) : (

                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-5">

                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {editableFeedback.personalizedFeedback ||
                      "No personalized feedback available."}
                  </p>

                </div>

              )}

            </div>

            {/* ==================================================
                SUGGESTED TOTAL
            =================================================== */}

            <div className="bg-white rounded-lg shadow-md p-6">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                <div>

                  <h3 className="text-xl font-bold text-gray-800">
                    Suggested Total Mark
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    AI-generated mark based on the provided
                    marking rubric.
                  </p>

                </div>

                {isEditing ? (

                  <input
                    id="suggestedTotal"
                    name="suggestedTotal"
                    type="number"
                    min="0"
                    value={
                      editableFeedback.suggestedTotal
                    }
                    onChange={handleEditChange}
                    className="w-full md:w-40 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-center text-2xl font-bold"
                  />

                ) : (

                  <div className="bg-indigo-50 rounded-lg px-8 py-4 text-center">

                    <p className="text-4xl font-bold text-indigo-700">
                      {editableFeedback.suggestedTotal ||
                        "—"}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      AI Suggested
                    </p>

                  </div>

                )}

              </div>

            </div>

            {/* ==================================================
                EXISTING APPROVED RESULT
            =================================================== */}

            {(aiFeedback.status === "approved" ||
              aiFeedback.finalTotal !== undefined ||
              aiFeedback.approvedFeedback) && (

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">

                  <h3 className="text-xl font-bold text-green-700">
                    Lecturer-Approved Result
                  </h3>

                  {aiFeedback.status ===
                    "approved" && (

                    <span className="inline-block w-fit px-4 py-2 bg-green-200 text-green-800 rounded-full text-sm font-semibold">
                      Approved
                    </span>

                  )}

                </div>

                {aiFeedback.finalTotal !==
                  undefined && (

                  <div className="mb-5">

                    <p className="text-sm text-gray-600">
                      Final Total
                    </p>

                    <p className="text-4xl font-bold text-green-700">
                      {aiFeedback.finalTotal}
                    </p>

                  </div>

                )}

                {aiFeedback.bonusMarks !==
                  undefined && (

                  <div className="mb-5">

                    <p className="text-sm text-gray-600">
                      Bonus Marks
                    </p>

                    <p className="text-2xl font-bold text-green-700">
                      +{aiFeedback.bonusMarks}
                    </p>

                  </div>

                )}

                {aiFeedback.approvedFeedback && (

                  <div className="mb-5">

                    <p className="font-semibold text-gray-800 mb-2">
                      Approved Feedback
                    </p>

                    <div className="bg-white rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {aiFeedback.approvedFeedback}
                      </p>
                    </div>

                  </div>

                )}

                {aiFeedback.lecturerComment && (

                  <div>

                    <p className="font-semibold text-gray-800 mb-2">
                      Lecturer Comment
                    </p>

                    <div className="bg-white rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {aiFeedback.lecturerComment}
                      </p>
                    </div>

                  </div>

                )}

              </div>

            )}

            {/* ==================================================
                APPROVED MARKS
            =================================================== */}

            {approvedMarks.length > 0 && (

              <div className="bg-white rounded-lg shadow-md p-6">

                <h3 className="text-xl font-bold text-green-700 mb-5">
                  Approved Marks
                </h3>

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[700px] border-collapse">

                    <thead>

                      <tr className="bg-green-50">

                        <th className="border border-gray-200 px-4 py-3 text-left">
                          Criterion
                        </th>

                        <th className="border border-gray-200 px-4 py-3 text-center">
                          Maximum Marks
                        </th>

                        <th className="border border-gray-200 px-4 py-3 text-center">
                          Final Marks
                        </th>

                        <th className="border border-gray-200 px-4 py-3 text-left">
                          Reason
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {approvedMarks.map(
                        (item, index) => (

                          <tr key={index}>

                            <td className="border border-gray-200 px-4 py-3 font-semibold">
                              {item?.criterion ||
                                "—"}
                            </td>

                            <td className="border border-gray-200 px-4 py-3 text-center">
                              {item?.maximumMarks ??
                                "—"}
                            </td>

                            <td className="border border-gray-200 px-4 py-3 text-center">

                              <span className="font-bold text-green-700">
                                {item?.finalMarks ??
                                  "—"}
                              </span>

                            </td>

                            <td className="border border-gray-200 px-4 py-3 text-gray-700">
                              {item?.reason ||
                                "—"}
                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            )}

            {/* ==================================================
                ACTION BUTTONS
            =================================================== */}

            <div className="bg-white rounded-lg shadow-md p-6">

              <div className="flex flex-col md:flex-row gap-3">

                {!isEditing ? (

                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setIsEditing(true)
                      }
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-5 rounded-md transition"
                    >
                      Edit Feedback & Marks
                    </button>

                    <button
                      type="button"
                      onClick={handleApprove}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-5 rounded-md transition"
                    >
                      Approve Feedback
                    </button>
                  </>

                ) : (

                  <>
                    <button
                      type="button"
                      onClick={handleSaveEdits}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-5 rounded-md transition"
                    >
                      Save Edits
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setIsEditing(false)
                      }
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-5 rounded-md transition"
                    >
                      Cancel Editing
                    </button>
                  </>

                )}

                <button
                  type="button"
                  onClick={handleGenerateAgain}
                  className="flex-1 border border-indigo-300 text-indigo-700 hover:bg-indigo-50 font-semibold py-3 px-5 rounded-md transition"
                >
                  Generate Again
                </button>

              </div>

              <p className="text-center text-xs text-gray-500 mt-4">
                AI-generated feedback should be reviewed by the
                lecturer before final approval.
              </p>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default CreateFeedback;