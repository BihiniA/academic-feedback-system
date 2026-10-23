import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = "http://localhost:7000/api/feedback";

const FeedbackApproval = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState(null);
  const [approvedFeedback, setApprovedFeedback] = useState("");
  const [approvedMarks, setApprovedMarks] = useState([]);
  const [bonusMarks, setBonusMarks] = useState("0");
  const [lecturerComment, setLecturerComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadOneFeedback = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_BASE}/${id}`);
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Unable to load this feedback record.");
        }

        setFeedback(result);
        setApprovedFeedback(result.approvedFeedback || result.personalizedFeedback || "");
        setLecturerComment(result.lecturerComment || "");
        setBonusMarks(String(result.bonusMarks ?? 0));

        const existingApproved = Array.isArray(result.approvedMarks)
          ? result.approvedMarks
          : [];
        const aiMarks = Array.isArray(result.rubricMarks)
          ? result.rubricMarks
          : [];

        const sourceMarks = existingApproved.length ? existingApproved : aiMarks;
        setApprovedMarks(sourceMarks.map((mark) => ({
          criterion: mark.criterion || "",
          maximumMarks: Number(mark.maximumMarks ?? 0),
          finalMarks: Number(
            mark.finalMarks ?? mark.suggestedMarks ?? 0
          ),
          reason: mark.reason || ""
        })));
      } catch (err) {
        console.error("Load feedback for approval error:", err);
        setError(err.message || "Unable to load feedback.");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadOneFeedback();
  }, [id]);

  const marksTotal = useMemo(
    () => approvedMarks.reduce((total, mark) => total + (Number(mark.finalMarks) || 0), 0),
    [approvedMarks]
  );

  const updateMark = (index, value) => {
    setApprovedMarks((current) => current.map((mark, i) =>
      i === index ? { ...mark, finalMarks: value } : mark
    ));
  };

  const handleApprove = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!approvedFeedback.trim()) {
      setError("Please enter the final feedback before approving.");
      return;
    }

    for (const mark of approvedMarks) {
      const max = Number(mark.maximumMarks);
      const final = Number(mark.finalMarks);
      if (!mark.criterion.trim() || !Number.isFinite(max) || !Number.isFinite(final) || max < 0 || final < 0 || final > max) {
        setError(`Please check the marks for “${mark.criterion || "unnamed criterion"}”. Final marks must be between 0 and the maximum.`);
        return;
      }
    }

    const bonus = Number(bonusMarks);
    if (!Number.isFinite(bonus) || bonus < 0) {
      setError("Bonus marks must be a valid non-negative number.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${API_BASE}/${id}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approvedFeedback: approvedFeedback.trim(),
          approvedMarks: approvedMarks.map((mark) => ({
            criterion: mark.criterion,
            maximumMarks: Number(mark.maximumMarks),
            finalMarks: Number(mark.finalMarks)
          })),
          bonusMarks: bonus,
          lecturerComment: lecturerComment.trim()
        })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Unable to approve feedback.");
      }

      setSuccess("Feedback approved successfully.");
      setFeedback((current) => current ? {
        ...current,
        status: "approved",
        approvedFeedback: approvedFeedback.trim(),
        approvedMarks,
        bonusMarks: bonus,
        finalTotal: marksTotal + bonus,
        lecturerComment: lecturerComment.trim()
      } : current);
    } catch (err) {
      console.error("Approve feedback error:", err);
      setError(err.message || "Unable to approve feedback.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 p-10 text-center text-gray-600">Loading feedback record...</div>;
  }

  if (error && !feedback) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
          <p className="text-red-700 mb-4">{error}</p>
          <button onClick={() => navigate(-1)} className="bg-indigo-600 text-white px-4 py-2 rounded-md">Go Back</button>
        </div>
      </div>
    );
  }

  if (!feedback) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="bg-white rounded-xl shadow p-6">
          <button type="button" onClick={() => navigate(-1)} className="text-indigo-700 font-semibold mb-4">← Back to History</button>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Lecturer Review</p>
              <h1 className="text-3xl font-bold text-indigo-700 mt-1">{feedback.assignmentName || "Untitled Assignment"}</h1>
              <p className="text-indigo-600 mt-1">{feedback.module || "Module not specified"}</p>
            </div>
            <span className={`inline-flex self-start px-3 py-1 rounded-full text-sm font-semibold ${feedback.status === "approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-800"}`}>
              {feedback.status === "approved" ? "Approved" : "Awaiting Review"}
            </span>
          </div>
        </header>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">{error}</div>}
        {success && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4">{success}</div>}

        <section className="bg-white rounded-xl shadow p-6 space-y-5">
          <h2 className="text-xl font-bold text-gray-800">Assignment and AI Analysis</h2>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Assignment Questions</h3>
            <p className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap">{feedback.assignmentQuestions || "Not provided"}</p>
          </div>
          {feedback.questionSpecification && <div>
            <h3 className="font-semibold text-gray-700 mb-2">Question Specification</h3>
            <p className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap">{feedback.questionSpecification}</p>
          </div>}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Marking Rubric</h3>
            <p className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap">{feedback.markingRubric || "Not provided"}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Student Answer</h3>
            <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 whitespace-pre-wrap overflow-x-auto text-sm">{feedback.studentAnswer || "Not provided"}</pre>
          </div>
          {feedback.analysis && <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">AI Analysis</h3>
            {[["Strengths", feedback.analysis.strengths], ["Coding Errors", feedback.analysis.codingErrors], ["Logical Weaknesses", feedback.analysis.logicalWeaknesses], ["Missing Requirements", feedback.analysis.missingRequirements], ["Improvement Suggestions", feedback.analysis.improvementSuggestions]].map(([title, value]) => (
              <div key={title} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-indigo-700 mb-2">{title}</h4>
                {Array.isArray(value) ? (value.length ? <ul className="list-disc pl-5 space-y-1">{value.map((item, i) => <li key={i}>{typeof item === "string" ? item : JSON.stringify(item)}</li>)}</ul> : <p className="text-gray-500">None listed.</p>) : <p className="whitespace-pre-wrap">{value || "None listed."}</p>}
              </div>
            ))}
          </div>}
        </section>

        <form onSubmit={handleApprove} className="bg-white rounded-xl shadow p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-indigo-700">Review and Approve</h2>
            <p className="text-sm text-gray-500 mt-1">Check the suggested marks, make changes if needed, then save the lecturer-approved result.</p>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">Final Feedback</label>
            <textarea value={approvedFeedback} onChange={(e) => setApprovedFeedback(e.target.value)} rows={7} required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Edit the feedback to be approved..." />
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Marks by Criterion</h3>
            {approvedMarks.length ? <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse">
                <thead><tr className="bg-indigo-50">
                  <th className="text-left p-3 border">Criterion</th>
                  <th className="text-center p-3 border">Maximum</th>
                  <th className="text-center p-3 border">AI Suggested</th>
                  <th className="text-center p-3 border">Lecturer Final Mark</th>
                </tr></thead>
                <tbody>{approvedMarks.map((mark, index) => {
                  const original = Array.isArray(feedback.rubricMarks) ? feedback.rubricMarks.find((item) => item.criterion === mark.criterion) : null;
                  return <tr key={`${mark.criterion}-${index}`}>
                    <td className="p-3 border font-medium">{mark.criterion}</td>
                    <td className="p-3 border text-center">{mark.maximumMarks}</td>
                    <td className="p-3 border text-center">{original?.suggestedMarks ?? "—"}</td>
                    <td className="p-3 border"><input type="number" min="0" max={mark.maximumMarks} step="any" value={mark.finalMarks} onChange={(e) => updateMark(index, e.target.value)} required className="w-28 border rounded-md p-2 text-center" /></td>
                  </tr>;
                })}</tbody>
              </table>
            </div> : <p className="text-gray-500">No rubric mark criteria were saved for this record. Check the marking rubric and contact the developer if marks should be available.</p>}
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <p className="font-semibold">Lecturer marks total: <span className="text-indigo-700">{marksTotal}</span></p>
              <label className="flex items-center gap-2">Bonus marks <input type="number" min="0" step="any" value={bonusMarks} onChange={(e) => setBonusMarks(e.target.value)} className="w-24 border rounded-md p-2" /></label>
              <p className="font-semibold">Final total: <span className="text-green-700">{marksTotal + (Number(bonusMarks) || 0)}</span></p>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">Lecturer Comment (optional)</label>
            <textarea value={lecturerComment} onChange={(e) => setLecturerComment(e.target.value)} rows={3} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Internal note or comment..." />
          </div>

          <div className="flex flex-wrap gap-3 border-t pt-5">
            <button type="submit" disabled={saving} className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold px-5 py-3 rounded-md">
              {saving ? "Saving..." : feedback.status === "approved" ? "Save Updated Approval" : "Approve Feedback"}
            </button>
            <button type="button" onClick={() => navigate("/history")} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-5 py-3 rounded-md">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackApproval;
