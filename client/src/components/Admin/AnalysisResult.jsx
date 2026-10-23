import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Analysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [approvedMarks, setApprovedMarks] = useState([]);
  const [approvedFeedback, setApprovedFeedback] = useState("");
  const [bonusMarks, setBonusMarks] = useState(0);
  const [lecturerComment, setLecturerComment] = useState("");

  // --------------------------------------------------
  // Fetch feedback from backend
  // --------------------------------------------------

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await fetch(
          `http://localhost:7000/api/feedback/${id}`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Unable to load feedback."
          );
        }

        setFeedback(result);

        // Prepare editable rubric marks
        if (Array.isArray(result.rubricMarks)) {
          const editableMarks = result.rubricMarks.map(
            (item) => ({
              criterion: item.criterion || "",
              maximumMarks:
                Number(item.maximumMarks) || 0,
              suggestedMarks:
                Number(item.suggestedMarks) || 0,
              finalMarks:
                Number(item.suggestedMarks) || 0,
              reason: item.reason || "",
            })
          );

          setApprovedMarks(editableMarks);
        }

        setApprovedFeedback(
          result.personalizedFeedback || ""
        );

        setBonusMarks(
          Number(result.bonusMarks) || 0
        );

        setLecturerComment(
          result.lecturerComment || ""
        );
      } catch (error) {
        console.error(
          "Error loading feedback:",
          error
        );

        setErrorMessage(
          error.message ||
            "Unable to load feedback."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchFeedback();
    }
  }, [id]);

  // --------------------------------------------------
  // Calculate lecturer marks
  // --------------------------------------------------

  const lecturerMarksTotal = approvedMarks.reduce(
    (total, item) =>
      total + (Number(item.finalMarks) || 0),
    0
  );

  const finalTotal =
    lecturerMarksTotal +
    (Number(bonusMarks) || 0);

  // --------------------------------------------------
  // Handle final mark changes
  // --------------------------------------------------

  const handleMarkChange = (index, value) => {
    const updatedMarks = [...approvedMarks];

    let newValue = Number(value);

    if (Number.isNaN(newValue)) {
      newValue = 0;
    }

    const maximum =
      Number(updatedMarks[index].maximumMarks) || 0;

    if (newValue < 0) {
      newValue = 0;
    }

    if (newValue > maximum) {
      newValue = maximum;
    }

    updatedMarks[index].finalMarks = newValue;

    setApprovedMarks(updatedMarks);
  };

  // --------------------------------------------------
  // Handle bonus marks
  // --------------------------------------------------

  const handleBonusMarksChange = (e) => {
    let value = Number(e.target.value);

    if (Number.isNaN(value)) {
      value = 0;
    }

    if (value < 0) {
      value = 0;
    }

    setBonusMarks(value);
  };

  // --------------------------------------------------
  // Approve feedback
  // --------------------------------------------------

  const handleApprove = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    // Validate marks
    for (const item of approvedMarks) {
      const finalMark =
        Number(item.finalMarks) || 0;

      const maximumMark =
        Number(item.maximumMarks) || 0;

      if (
        finalMark < 0 ||
        finalMark > maximumMark
      ) {
        setErrorMessage(
          `The mark for "${item.criterion}" must be between 0 and ${maximumMark}.`
        );
        return;
      }
    }

    if (!approvedFeedback.trim()) {
      setErrorMessage(
        "Please provide the final feedback before approving."
      );
      return;
    }

    setIsApproving(true);

    try {
      const response = await fetch(
        `http://localhost:7000/api/feedback/${id}/approve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            approvedFeedback:
              approvedFeedback.trim(),

            approvedMarks: approvedMarks.map(
              (item) => ({
                criterion: item.criterion,
                maximumMarks:
                  Number(item.maximumMarks) || 0,
                finalMarks:
                  Number(item.finalMarks) || 0,
                reason: item.reason || "",
              })
            ),

            bonusMarks:
              Number(bonusMarks) || 0,

            lecturerComment:
              lecturerComment.trim(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to approve feedback."
        );
      }

      setSuccessMessage(
        "Feedback approved successfully."
      );

      // Update displayed feedback with backend response
      if (result.feedback) {
        setFeedback(result.feedback);
      }

      // Scroll to top
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(
        "Approve feedback error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Unable to approve feedback."
      );
    } finally {
      setIsApproving(false);
    }
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">

          <div className="bg-white rounded-lg shadow-md p-10 text-center">

            <div className="flex justify-center mb-4">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>

            <h2 className="text-xl font-semibold text-gray-800">
              Loading AI Analysis...
            </h2>

            <p className="text-gray-500 mt-2">
              Please wait while the feedback is retrieved.
            </p>

          </div>

        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (errorMessage && !feedback) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">

          <div className="bg-white rounded-lg shadow-md p-6">

            <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg p-4 mb-6">
              <strong>Error:</strong>{" "}
              {errorMessage}
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-md"
            >
              Back to Dashboard
            </button>

          </div>

        </div>
      </div>
    );
  }

  if (!feedback) {
    return null;
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">

      <div className="max-w-5xl mx-auto">

        {/* ------------------------------------------ */}
        {/* Header */}
        {/* ------------------------------------------ */}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h1 className="text-3xl font-bold text-indigo-700 mb-2">
                AI Feedback Review
              </h1>

              <p className="text-gray-600">
                Review the AI-generated analysis and
                make the final academic decision.
              </p>
            </div>

            <div>
              <span
                className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${
                  feedback.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {feedback.status === "approved"
                  ? "Approved"
                  : "Pending Review"}
              </span>
            </div>

          </div>

        </div>

        {/* ------------------------------------------ */}
        {/* Success */}
        {/* ------------------------------------------ */}

        {successMessage && (
          <div className="bg-green-50 border border-green-300 text-green-700 rounded-lg p-4 mb-6">
            <strong>Success:</strong>{" "}
            {successMessage}
          </div>
        )}

        {/* ------------------------------------------ */}
        {/* Error */}
        {/* ------------------------------------------ */}

        {errorMessage && (
          <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg p-4 mb-6">
            <strong>Error:</strong>{" "}
            {errorMessage}
          </div>
        )}

        {/* ------------------------------------------ */}
        {/* Assignment Information */}
        {/* ------------------------------------------ */}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">

          <h2 className="text-xl font-bold text-gray-800 mb-5">
            Assignment Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <p className="text-sm font-semibold text-gray-500">
                Module
              </p>

              <p className="text-gray-800 mt-1">
                {feedback.module}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-500">
                Assignment
              </p>

              <p className="text-gray-800 mt-1">
                {feedback.assignmentName}
              </p>
            </div>

          </div>

          <div className="mt-5">

            <p className="text-sm font-semibold text-gray-500 mb-2">
              Assignment Question
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 whitespace-pre-wrap text-gray-700">
              {feedback.assignmentQuestions}
            </div>

          </div>

        </div>

        {/* ------------------------------------------ */}
        {/* AI Analysis */}
        {/* ------------------------------------------ */}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">

          <div className="flex items-center justify-between mb-5">

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                AI Analysis
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                AI-generated observations for lecturer review.
              </p>
            </div>

            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
              AI Assisted
            </span>

          </div>

          {/* Strengths */}

          <div className="mb-6">

            <h3 className="text-lg font-semibold text-green-700 mb-3">
              Strengths
            </h3>

            {feedback.analysis?.strengths?.length > 0 ? (
              <ul className="space-y-2">
                {feedback.analysis.strengths.map(
                  (item, index) => (
                    <li
                      key={index}
                      className="bg-green-50 border border-green-200 rounded-md p-3 text-gray-700"
                    >
                      <span className="font-semibold mr-2">
                        {index + 1}.
                      </span>
                      {item}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="text-gray-500">
                No strengths were identified.
              </p>
            )}

          </div>

          {/* Coding Errors */}

          <div className="mb-6">

            <h3 className="text-lg font-semibold text-red-700 mb-3">
              Coding Errors
            </h3>

            {feedback.analysis?.codingErrors?.length > 0 ? (
              <ul className="space-y-2">
                {feedback.analysis.codingErrors.map(
                  (item, index) => (
                    <li
                      key={index}
                      className="bg-red-50 border border-red-200 rounded-md p-3 text-gray-700"
                    >
                      <span className="font-semibold mr-2">
                        {index + 1}.
                      </span>
                      {item}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="text-gray-500">
                No coding errors were identified.
              </p>
            )}

          </div>

          {/* Logical Weaknesses */}

          <div className="mb-6">

            <h3 className="text-lg font-semibold text-orange-700 mb-3">
              Logical Weaknesses
            </h3>

            {feedback.analysis?.logicalWeaknesses?.length > 0 ? (
              <ul className="space-y-2">
                {feedback.analysis.logicalWeaknesses.map(
                  (item, index) => (
                    <li
                      key={index}
                      className="bg-orange-50 border border-orange-200 rounded-md p-3 text-gray-700"
                    >
                      <span className="font-semibold mr-2">
                        {index + 1}.
                      </span>
                      {item}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="text-gray-500">
                No logical weaknesses were identified.
              </p>
            )}

          </div>

          {/* Missing Requirements */}

          <div className="mb-6">

            <h3 className="text-lg font-semibold text-purple-700 mb-3">
              Missing Requirements
            </h3>

            {feedback.analysis?.missingRequirements?.length > 0 ? (
              <ul className="space-y-2">
                {feedback.analysis.missingRequirements.map(
                  (item, index) => (
                    <li
                      key={index}
                      className="bg-purple-50 border border-purple-200 rounded-md p-3 text-gray-700"
                    >
                      <span className="font-semibold mr-2">
                        {index + 1}.
                      </span>
                      {item}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="text-gray-500">
                No missing requirements were identified.
              </p>
            )}

          </div>

          {/* Improvement Suggestions */}

          <div>

            <h3 className="text-lg font-semibold text-indigo-700 mb-3">
              Improvement Suggestions
            </h3>

            {feedback.analysis?.improvementSuggestions?.length > 0 ? (
              <ul className="space-y-2">
                {feedback.analysis.improvementSuggestions.map(
                  (item, index) => (
                    <li
                      key={index}
                      className="bg-indigo-50 border border-indigo-200 rounded-md p-3 text-gray-700"
                    >
                      <span className="font-semibold mr-2">
                        {index + 1}.
                      </span>
                      {item}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="text-gray-500">
                No improvement suggestions were provided.
              </p>
            )}

          </div>

        </div>

        {/* ------------------------------------------ */}
        {/* Rubric Marks */}
        {/* ------------------------------------------ */}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">

          <div className="mb-5">

            <h2 className="text-xl font-bold text-gray-800">
              Rubric-Based Marks
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              AI suggested marks are provisional. The
              lecturer can edit the final marks before
              approval.
            </p>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full border-collapse">

              <thead>
                <tr className="bg-indigo-50">

                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Criterion
                  </th>

                  <th className="border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Maximum
                  </th>

                  <th className="border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    AI Suggested
                  </th>

                  <th className="border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Final Mark
                  </th>

                </tr>
              </thead>

              <tbody>

                {approvedMarks.length > 0 ? (
                  approvedMarks.map(
                    (item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50"
                      >

                        <td className="border border-gray-200 px-4 py-4">

                          <p className="font-medium text-gray-800">
                            {item.criterion}
                          </p>

                          {item.reason && (
                            <p className="text-xs text-gray-500 mt-2">
                              AI reasoning:{" "}
                              {item.reason}
                            </p>
                          )}

                        </td>

                        <td className="border border-gray-200 px-4 py-4 text-center text-gray-700">
                          {item.maximumMarks}
                        </td>

                        <td className="border border-gray-200 px-4 py-4 text-center">

                          <span className="inline-flex bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold">
                            {item.suggestedMarks}
                          </span>

                        </td>

                        <td className="border border-gray-200 px-4 py-4">

                          <input
                            type="number"
                            min="0"
                            max={item.maximumMarks}
                            step="1"
                            value={item.finalMarks}
                            onChange={(e) =>
                              handleMarkChange(
                                index,
                                e.target.value
                              )
                            }
                            disabled={
                              feedback.status ===
                              "approved"
                            }
                            className="w-24 mx-auto block text-center px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />

                        </td>

                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="border border-gray-200 px-4 py-6 text-center text-gray-500"
                    >
                      No rubric marks available.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

          {/* Marks Summary */}

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">

              <p className="text-sm text-gray-500">
                AI Suggested Total
              </p>

              <p className="text-2xl font-bold text-indigo-700 mt-1">
                {feedback.suggestedTotal ?? 0}
              </p>

            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">

              <p className="text-sm text-blue-600">
                Lecturer Marks Total
              </p>

              <p className="text-2xl font-bold text-blue-700 mt-1">
                {lecturerMarksTotal}
              </p>

            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">

              <p className="text-sm text-green-600">
                Final Total
              </p>

              <p className="text-2xl font-bold text-green-700 mt-1">
                {finalTotal}
              </p>

            </div>

          </div>

        </div>

        {/* ------------------------------------------ */}
        {/* Bonus Marks */}
        {/* ------------------------------------------ */}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">

          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Additional / Bonus Marks
          </h2>

          <p className="text-sm text-gray-500 mb-5">
            If the student has implemented additional
            functionality beyond the specified requirements,
            the lecturer may award bonus marks.
          </p>

          <div className="max-w-xs">

            <label
              htmlFor="bonusMarks"
              className="block text-gray-700 font-semibold mb-2"
            >
              Bonus Marks
            </label>

            <input
              type="number"
              id="bonusMarks"
              min="0"
              step="1"
              value={bonusMarks}
              onChange={handleBonusMarksChange}
              disabled={
                feedback.status === "approved"
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
            />

          </div>

        </div>

        {/* ------------------------------------------ */}
        {/* Personalized Feedback */}
        {/* ------------------------------------------ */}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">

          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Personalized Feedback
          </h2>

          <p className="text-sm text-gray-500 mb-4">
            Review and edit the AI-generated feedback before
            sending it to the student.
          </p>

          <textarea
            value={approvedFeedback}
            onChange={(e) =>
              setApprovedFeedback(e.target.value)
            }
            rows={8}
            disabled={
              feedback.status === "approved"
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none disabled:bg-gray-100"
            placeholder="Enter final feedback for the student..."
          />

        </div>

        {/* ------------------------------------------ */}
        {/* Lecturer Comment */}
        {/* ------------------------------------------ */}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">

          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Lecturer Comment
          </h2>

          <p className="text-sm text-gray-500 mb-4">
            Add any additional comments or justification
            for the final academic decision.
          </p>

          <textarea
            value={lecturerComment}
            onChange={(e) =>
              setLecturerComment(e.target.value)
            }
            rows={5}
            disabled={
              feedback.status === "approved"
            }
            placeholder="Example: Student implemented an additional search filter that was not explicitly required in the assignment."
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none disabled:bg-gray-100"
          />

        </div>

        {/* ------------------------------------------ */}
        {/* Human-in-the-loop notice */}
        {/* ------------------------------------------ */}

        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-5 mb-6">

          <h3 className="font-bold text-yellow-800 mb-2">
            Lecturer Review Required
          </h3>

          <p className="text-sm text-yellow-800">
            The AI-generated analysis and marks are
            recommendations only. The lecturer is responsible
            for reviewing the analysis, modifying the marks
            where necessary, and approving the final result.
          </p>

        </div>

        {/* ------------------------------------------ */}
        {/* Final Approval */}
        {/* ------------------------------------------ */}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <p className="text-sm text-gray-500">
                Final Result
              </p>

              <p className="text-4xl font-bold text-indigo-700 mt-1">
                {finalTotal}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Lecturer marks + bonus marks
              </p>

            </div>

            <div className="flex flex-col sm:flex-row gap-3">

              <button
                type="button"
                onClick={() =>
                  navigate("/dashboard")
                }
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition"
              >
                Back to Dashboard
              </button>

              {feedback.status !== "approved" && (
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md transition disabled:bg-indigo-300 disabled:cursor-not-allowed"
                >
                  {isApproving
                    ? "Approving..."
                    : "Approve Final Feedback"}
                </button>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Analysis;