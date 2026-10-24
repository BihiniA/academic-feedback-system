
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateFeedback = () => {
  const navigate = useNavigate();

  // ============================================================
  // FORM DATA - ONLY THESE TEXT VALUES ARE SENT TO THE BACKEND
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

  // The following filenames are frontend-only.
  // They are deliberately excluded from formData and the API request.

  const [questionFileName, setQuestionFileName] = useState("");
  const [rubricFileName, setRubricFileName] = useState("");
  const [answerFileName, setAnswerFileName] = useState("");

  // ============================================================
  // HANDLE TEXT INPUT CHANGES
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
  // GENERIC FRONTEND-ONLY FILE SELECTION
  // ============================================================

  const handleFileChange = (e, setFileName) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setFileName(file.name);

    // IMPORTANT:
    // The file is not uploaded, read, or sent to the backend.
    // Only its filename is displayed in this interface.
  };

  // ============================================================
  // REMOVE SELECTED DEMONSTRATION FILE
  // ============================================================

  const handleRemoveFile = (inputId, setFileName) => {
    setFileName("");

    const fileInput = document.getElementById(inputId);

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // ============================================================
  // REUSABLE FILE UPLOAD DISPLAY
  // ============================================================

  const renderFileUpload = ({
    inputId,
    label,
    fileName,
    setFileName,
  }) => (
    <div className="mb-6">
      <label
        htmlFor={inputId}
        className="block text-gray-700 font-semibold mb-2"
      >
        {label}
        <span className="text-gray-500 font-normal ml-2">
          (Optional)
        </span>
      </label>

      <input
        type="file"
        id={inputId}
        accept=".pdf,.docx,.txt,.py,.java,.js,.cpp,.c"
        onChange={(e) => handleFileChange(e, setFileName)}
        className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {fileName && (
        <div className="mt-3 flex items-center justify-between gap-3 bg-indigo-50 border border-indigo-200 rounded-md p-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-indigo-600 text-xl">
              📄
            </span>

            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-700 break-all">
                {fileName}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Selected for demonstration only
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              handleRemoveFile(inputId, setFileName)
            }
            className="text-sm text-red-600 hover:text-red-800 font-semibold flex-shrink-0"
          >
            Remove
          </button>
        </div>
      )}

      <p className="text-sm text-gray-500 mt-2">
        This upload is for frontend demonstration only.
        The selected file is not sent to the backend.
        Enter the content in the text area above to use it
        for feedback generation.
      </p>
    </div>
  );

  // ============================================================
  // GENERATE AI FEEDBACK
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // ----------------------------------------------------------
    // VALIDATION
    // Text is required even if a demonstration file is selected.
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
      setErrorMessage(
        "Please enter the assignment questions in the text area. Selecting a file alone is not sufficient."
      );
      return;
    }

    if (!formData.markingRubric.trim()) {
      setErrorMessage(
        "Please enter the marking rubric in the text area. Selecting a file alone is not sufficient."
      );
      return;
    }

    if (!formData.studentAnswer.trim()) {
      setErrorMessage(
        "Please enter the student's answer or programming code in the text area. Selecting a file alone is not sufficient."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Send only text data as JSON.
      // questionFileName, rubricFileName, and answerFileName
      // are intentionally not included in this request.

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

      const responseText = await response.text();

      let result = {};

      try {
        result = responseText
          ? JSON.parse(responseText)
          : {};
      } catch {
        result = {
          message:
            responseText ||
            "The server returned an empty response.",
        };
      }

      console.log("API RESPONSE STATUS:", response.status);
      console.log("API RESPONSE:", result);

      if (!response.ok) {
        const serverMessage =
          result.message ||
          result.error ||
          result.err ||
          "";

        const readableMessage = String(serverMessage)
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim();

        throw new Error(
          readableMessage ||
            `Request failed with status ${response.status}.`
        );
      }

      const successMessage =
        result.message ||
        "Feedback created successfully!";

      window.alert(successMessage);

      navigate("/history", {
        state: { successMessage },
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
  // PAGE UI
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 overflow-x-hidden">
      <div className="w-full max-w-6xl mx-auto">

        {/* PAGE HEADER */}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">
            Create New Feedback
          </h1>

          <p className="text-gray-600">
            Generate AI-assisted programming assignment
            feedback and suggested marks for lecturer review.
          </p>
        </div>

        {/* ERROR MESSAGE */}

        {errorMessage && (
          <div
            role="alert"
            className="bg-red-50 border border-red-300 text-red-700 rounded-lg p-4 mb-6"
          >
            <p className="font-semibold mb-1">
              Please check the following
            </p>

            <p>{errorMessage}</p>
          </div>
        )}

        {/* CREATE FEEDBACK FORM */}

        <form
          onSubmit={handleSubmit}
          className="bg-white border-2 border-indigo-200 rounded-lg shadow-md p-6"
        >

          {/* MODULE */}

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
              <option value="">Select Module</option>
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

          {/* ASSIGNMENT NAME */}

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
              placeholder="e.g. Assignment 01 - Programming"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* STUDENT NAME */}

          <div className="mb-5">
            <label
              htmlFor="studentName"
              className="block text-gray-700 font-semibold mb-2"
            >
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

          {/* STUDENT ID */}

          <div className="mb-5">
            <label
              htmlFor="studentId"
              className="block text-gray-700 font-semibold mb-2"
            >
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

          {/* ================================================== */}
          {/* ASSIGNMENT QUESTIONS */}
          {/* ================================================== */}

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
              required
            />
          </div>

          {renderFileUpload({
            inputId: "questionFile",
            label: "Upload Assignment Question File",
            fileName: questionFileName,
            setFileName: setQuestionFileName,
          })}

          {/* ================================================== */}
          {/* QUESTION SPECIFICATION */}
          {/* ================================================== */}

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
              value={formData.questionSpecification}
              onChange={handleChange}
              rows={4}
              placeholder="Enter additional instructions, requirements, constraints, or expectations..."
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* ================================================== */}
          {/* MARKING RUBRIC */}
          {/* ================================================== */}

          <div className="mb-5">
            <label
              htmlFor="markingRubric"
              className="block text-gray-700 font-semibold mb-2"
            >
              Marking Rubric
            </label>

            <textarea
              id="markingRubric"
              name="markingRubric"
              value={formData.markingRubric}
              onChange={handleChange}
              rows={5}
              placeholder="Type or paste the marking criteria and rubric here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              required
            />
          </div>

          {renderFileUpload({
            inputId: "rubricFile",
            label: "Upload Marking Rubric File",
            fileName: rubricFileName,
            setFileName: setRubricFileName,
          })}

          {/* ================================================== */}
          {/* STUDENT ANSWER */}
          {/* ================================================== */}

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
              required
            />
          </div>

          {renderFileUpload({
            inputId: "answerFile",
            label: "Upload Student Answer / Code File",
            fileName: answerFileName,
            setFileName: setAnswerFileName,
          })}

          {/* SUBMIT BUTTON */}

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
            AI-generated feedback and suggested marks must
            be reviewed by the lecturer before approval.
          </p>
        </form>
      </div>
    </div>
  );
};

export default CreateFeedback;
