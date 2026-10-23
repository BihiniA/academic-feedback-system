import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateFeedback = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState({
    module: "",
    assignmentName: "",
    assignmentQuestions: "",
    questionSpecification: "",
    markingRubric: "",
    studentAnswer: "",
    generatedFeedback: "",
  });

  const [loading, setLoading] = useState(false);

  // Fetch feedback details based on the ID
  useEffect(() => {
    setLoading(true);

    fetch(`http://localhost:7000/api/feedback/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setFeedback(data);
        } else {
          console.error("Feedback not found");
        }
      })
      .catch((error) =>
        console.error("Error fetching feedback details:", error)
      )
      .finally(() => setLoading(false));
  }, [id]);

  // Handle feedback update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:7000/api/update/feedback/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(feedback),
        }
      );

      if (response.ok) {
        alert("Feedback updated successfully");
        navigate("/lecturer/feedback-history");
      } else {
        console.error("Failed to update feedback");
        alert("Failed to update feedback");
      }
    } catch (error) {
      console.error("Error updating feedback:", error);
      alert("An error occurred while updating feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white border-2 border-indigo-500 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-indigo-600 mb-4">
        Edit & Review Feedback
      </h2>

      {loading ? (
        <div className="text-gray-600">Loading...</div>
      ) : (
        <form onSubmit={handleUpdate}>

          {/* Module */}
          <div className="mb-4">
            <label
              htmlFor="module"
              className="block text-gray-700 mb-1"
            >
              Module:
            </label>

            <select
              id="module"
              name="module"
              value={feedback.module}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

          {/* Assignment Name */}
          <div className="mb-4">
            <label
              htmlFor="assignmentName"
              className="block text-gray-700 mb-1"
            >
              Assignment Name:
            </label>

            <input
              type="text"
              id="assignmentName"
              name="assignmentName"
              value={feedback.assignmentName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Assignment Questions */}
          <div className="mb-4">
            <label
              htmlFor="assignmentQuestions"
              className="block text-gray-700 mb-1"
            >
              Assignment Questions:
            </label>

            <textarea
              id="assignmentQuestions"
              name="assignmentQuestions"
              value={feedback.assignmentQuestions}
              onChange={handleChange}
              rows="6"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              required
            />
          </div>

          {/* Question Specification */}
          <div className="mb-4">
            <label
              htmlFor="questionSpecification"
              className="block text-gray-700 mb-1"
            >
              Question Specification:
              <span className="text-gray-500 font-normal ml-1">
                (Optional)
              </span>
            </label>

            <textarea
              id="questionSpecification"
              name="questionSpecification"
              value={feedback.questionSpecification}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Marking Rubric */}
          <div className="mb-4">
            <label
              htmlFor="markingRubric"
              className="block text-gray-700 mb-1"
            >
              Marking Rubric:
              <span className="text-gray-500 font-normal ml-1">
                (Optional)
              </span>
            </label>

            <textarea
              id="markingRubric"
              name="markingRubric"
              value={feedback.markingRubric}
              onChange={handleChange}
              rows="5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Student Answer */}
          <div className="mb-4">
            <label
              htmlFor="studentAnswer"
              className="block text-gray-700 mb-1"
            >
              Student Answer:
            </label>

            <textarea
              id="studentAnswer"
              name="studentAnswer"
              value={feedback.studentAnswer}
              onChange={handleChange}
              rows="8"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              required
            />
          </div>

          {/* Generated AI Feedback */}
          <div className="mb-6">
            <label
              htmlFor="generatedFeedback"
              className="block text-gray-700 mb-1"
            >
              Generated AI Feedback:
            </label>

            <textarea
              id="generatedFeedback"
              name="generatedFeedback"
              value={feedback.generatedFeedback}
              onChange={handleChange}
              rows="8"
              placeholder="Review or edit the generated AI feedback..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />

            <p className="text-xs text-gray-500 mt-1">
              Academic staff can review and edit the AI-generated feedback
              before finalizing it.
            </p>
          </div>

          {/* Submit Button */}
          <div className="mb-4">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Feedback"}
            </button>
          </div>

        </form>
      )}
    </div>
  );
};

export default UpdateFeedback;