import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const FeedbackReview = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const analysis = location.state?.analysis;

  const [feedback, setFeedback] = useState(
    analysis?.personalizedFeedback ||
      "The student has demonstrated a basic understanding of the programming concepts. However, some logical issues and missing requirements should be addressed. The student should review the calculation logic, improve input validation, and ensure that all assignment requirements are followed."
  );

  const [isApproving, setIsApproving] = useState(false);

  const handleApprove = async () => {
    setIsApproving(true);

    try {
      /*
       * Later this will send the approved feedback
       * to the Node.js / Express backend.
       *
       * Example:
       *
       * await fetch("http://localhost:7000/api/feedback/approve", {
       *   method: "PUT",
       *   headers: {
       *     "Content-Type": "application/json",
       *   },
       *   body: JSON.stringify({
       *     feedback,
       *   }),
       * });
       */

      alert("Feedback approved successfully.");

      navigate("/dashboard");

    } catch (error) {
      console.error("Error approving feedback:", error);

      alert("Unable to approve the feedback.");
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">

      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">

          <h1 className="text-3xl font-bold text-indigo-700">
            Review & Edit Feedback
          </h1>

          <p className="text-gray-600 mt-2">
            Review the AI-generated feedback before approving it
            for the student.
          </p>

        </div>

        {/* Human Oversight Notice */}
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">

          <p className="text-yellow-800 text-sm">
            <strong>Lecturer Review Required:</strong> Please
            verify the accuracy and academic appropriateness of
            the AI-generated feedback before approving it.
          </p>

        </div>

        {/* Feedback Editor */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">

          <label
            htmlFor="feedback"
            className="block text-gray-700 font-semibold mb-3"
          >
            Personalized Feedback
          </label>

          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={12}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-7"
          />

          <p className="text-sm text-gray-500 mt-2">
            You can edit the AI-generated feedback before
            approving it.
          </p>

        </div>

        {/* Suggestions Summary */}
        {analysis?.improvementSuggestions && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-6">

            <h2 className="text-lg font-bold text-indigo-700 mb-3">
              Improvement Suggestions Used
            </h2>

            <ul className="list-disc pl-5 space-y-2 text-gray-700">

              {analysis.improvementSuggestions.map(
                (suggestion, index) => (
                  <li key={index}>
                    {suggestion}
                  </li>
                )
              )}

            </ul>

          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">

          <div className="flex flex-col sm:flex-row gap-4">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-md"
            >
              Back to Analysis
            </button>

            <button
              type="button"
              onClick={handleApprove}
              disabled={isApproving || !feedback.trim()}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md disabled:bg-green-300 disabled:cursor-not-allowed"
            >
              {isApproving
                ? "Approving..."
                : "Approve Feedback"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default FeedbackReview;