import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:7000/api/feedback";

const FeedbackHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [feedbackList, setFeedbackList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || ""
  );

  useEffect(() => {
    fetchFeedbackHistory();
    // Read the route message once when this page opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFeedbackHistory = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch(API_URL);
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.message || result.error || "Unable to load feedback history.");
      }
      const records = Array.isArray(result)
        ? result
        : Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.feedback)
            ? result.feedback
            : Array.isArray(result.records)
              ? result.records
              : null;
      if (!records) throw new Error("The feedback API response did not contain a feedback list.");
      setFeedbackList(records);
    } catch (error) {
      console.error("Error loading feedback history:", error);
      setErrorMessage(error.message || "Unable to load feedback history. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFeedback = () => navigate("/admin/feedback/create-feedback");
  const handleReviewFeedback = (id) => navigate(`/admin/feedback/${id}/approve`);

  const handleDeleteFeedback = async (feedback) => {
    const label = feedback.assignmentName || "this feedback record";
    if (!window.confirm(`Are you sure you want to delete ${label}? This action cannot be undone.`)) return;
    try {
      const response = await fetch(`${API_URL}/${feedback._id}`, { method: "DELETE" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Unable to delete feedback record.");
      setFeedbackList((current) => current.filter((item) => item._id !== feedback._id));
      setExpandedId((current) => current === feedback._id ? null : current);
      setSuccessMessage(result.message || "Feedback record deleted successfully.");
    } catch (error) {
      console.error("Delete feedback error:", error);
      window.alert(error.message || "Unable to delete feedback record.");
    }
  };

  const toggleRecord = (id) => setExpandedId((previous) => previous === id ? null : id);
  const formatDateTime = (value) => {
    if (!value) return "Not available";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Not available";
    return date.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };
  const getStatusStyle = (status) => status === "approved"
    ? "bg-green-100 text-green-700 border-green-200"
    : "bg-yellow-100 text-yellow-700 border-yellow-200";
  const getStatusText = (status) => status === "approved" ? "Approved" : "AI Generated";
  const safeArray = (value) => Array.isArray(value) ? value : value !== null && value !== undefined && String(value).trim() ? [String(value)] : [];

  const renderList = (items, emptyText = "No information available.") => {
    const list = safeArray(items);
    if (!list.length) return <p className="text-gray-500 text-sm">{emptyText}</p>;
    return <div className="space-y-3">{list.map((item, index) => (
      <div key={index} className="flex items-start gap-3">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">{index + 1}</span>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{typeof item === "string" ? item : JSON.stringify(item)}</p>
      </div>
    ))}</div>;
  };

  const renderInfoCard = (title, content, emptyText = "No information available.", code = false) => (
    <section className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
      {code ? (
        <pre className="bg-gray-900 text-gray-100 rounded-lg p-5 overflow-x-auto whitespace-pre-wrap text-sm leading-relaxed">{content || emptyText}</pre>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{content || emptyText}</p></div>
      )}
    </section>
  );

  const filteredFeedback = useMemo(() => feedbackList.filter((feedback) => {
    const search = searchTerm.trim().toLowerCase();
    const matchesSearch = !search ||
      feedback.assignmentName?.toLowerCase().includes(search) ||
      feedback.module?.toLowerCase().includes(search) ||
      feedback.studentName?.toLowerCase().includes(search) ||
      feedback.studentId?.toLowerCase().includes(search) ||
      feedback.studentAnswer?.toLowerCase().includes(search);
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "approved" ? feedback.status === "approved" : feedback.status !== "approved");
    return matchesSearch && matchesStatus;
  }), [feedbackList, searchTerm, statusFilter]);

  const approvedCount = feedbackList.filter((item) => item.status === "approved").length;
  const generatedCount = feedbackList.length - approvedCount;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto">
        <header className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <h1 className="text-3xl font-bold text-indigo-700 mb-2">Feedback History</h1>
              <p className="text-gray-600">View all previously generated AI academic feedback and lecturer-approved results.</p>
            </div>
            <button type="button" onClick={handleCreateFeedback} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-md transition">+ Create New Feedback</button>
          </div>
        </header>

        {successMessage && (
          <div className="flex items-center justify-between gap-4 bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6">
            <p>{successMessage}</p>
            <button type="button" onClick={() => setSuccessMessage("")} className="font-bold px-2" aria-label="Dismiss message">×</button>
          </div>
        )}

        {!isLoading && !errorMessage && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5"><p className="text-sm text-gray-500 font-medium">Total Feedback</p><p className="text-3xl font-bold text-indigo-700 mt-1">{feedbackList.length}</p><p className="text-xs text-gray-500 mt-2">All generated records</p></div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5"><p className="text-sm text-gray-500 font-medium">Approved</p><p className="text-3xl font-bold text-green-600 mt-1">{approvedCount}</p><p className="text-xs text-gray-500 mt-2">Lecturer-approved records</p></div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5"><p className="text-sm text-gray-500 font-medium">Awaiting Review</p><p className="text-3xl font-bold text-yellow-600 mt-1">{generatedCount}</p><p className="text-xs text-gray-500 mt-2">AI-generated records</p></div>
          </div>
        )}

        {!isLoading && !errorMessage && feedbackList.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2"><label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2">Search Feedback</label><input id="search" type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by assignment, module, student name or ID..." className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label htmlFor="statusFilter" className="block text-sm font-semibold text-gray-700 mb-2">Status</label><select id="statusFilter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"><option value="all">All Feedback</option><option value="approved">Approved</option><option value="generated">AI Generated</option></select></div>
            </div>
          </div>
        )}

        {errorMessage && <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg p-5 mb-6"><div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"><div><p className="font-semibold">Unable to load feedback history</p><p className="text-sm mt-1">{errorMessage}</p></div><button type="button" onClick={fetchFeedbackHistory} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold">Try Again</button></div></div>}

        {isLoading && <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-12 text-center"><div className="flex justify-center mb-4"><div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /></div><p className="text-gray-600 font-medium">Loading feedback history...</p></div>}

        {!isLoading && !errorMessage && feedbackList.length === 0 && <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-12 text-center"><div className="text-5xl mb-4">📋</div><h2 className="text-xl font-bold text-gray-800 mb-2">No Feedback Records Found</h2><p className="text-gray-600 mb-6">You have not generated any academic feedback yet.</p><button type="button" onClick={handleCreateFeedback} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-md">Create Your First Feedback</button></div>}

        {!isLoading && !errorMessage && feedbackList.length > 0 && filteredFeedback.length === 0 && <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-10 text-center"><div className="text-4xl mb-4">🔍</div><h2 className="text-xl font-bold text-gray-800 mb-2">No Matching Feedback</h2><p className="text-gray-600">No feedback records match your search or selected status.</p></div>}

        {!isLoading && !errorMessage && filteredFeedback.length > 0 && (
          <div className="space-y-5">
            {filteredFeedback.map((feedback, index) => {
              const analysis = feedback.analysis || {};
              const rubricMarks = Array.isArray(feedback.rubricMarks) ? feedback.rubricMarks : [];
              const approvedMarks = Array.isArray(feedback.approvedMarks) ? feedback.approvedMarks : [];
              const isExpanded = expandedId === feedback._id;
              return (
                <article key={feedback._id || index} className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-2"><span className="text-sm font-semibold text-gray-400">#{index + 1}</span><span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(feedback.status)}`}>{getStatusText(feedback.status)}</span></div>
                        <h2 className="text-xl font-bold text-gray-800 break-words">{feedback.assignmentName || "Untitled Assignment"}</h2>
                        <p className="text-sm text-indigo-600 font-medium mt-1">{feedback.module || "Module not specified"}</p>
                        {(feedback.studentName || feedback.studentId) && <p className="text-sm text-gray-600 mt-2">Student: {feedback.studentName || "Not available"}{feedback.studentId ? ` (${feedback.studentId})` : ""}</p>}
                        <p className="text-xs text-gray-500 mt-2">Created: {formatDateTime(feedback.createdAt)}</p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <div className="bg-indigo-50 rounded-lg px-5 py-3 min-w-[130px] text-center"><p className="text-xs text-gray-500">AI Suggested</p><p className="text-2xl font-bold text-indigo-700">{typeof feedback.suggestedTotal === "number" ? feedback.suggestedTotal : "—"}</p></div>
                        <div className="bg-green-50 rounded-lg px-5 py-3 min-w-[130px] text-center"><p className="text-xs text-gray-500">Final Total</p><p className="text-2xl font-bold text-green-700">{feedback.status === "approved" && typeof feedback.finalTotal === "number" ? feedback.finalTotal : "—"}</p></div>
                      </div>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button type="button" onClick={() => handleReviewFeedback(feedback._id)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md transition">Edit for Lecturer</button>
                      <button type="button" onClick={() => handleDeleteFeedback(feedback)} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md transition">Delete</button>
                    </div>
                    <div className="mt-5 pt-5 border-t border-gray-100"><button type="button" onClick={() => toggleRecord(feedback._id)} className="w-full flex items-center justify-between text-left"><span className="font-semibold text-indigo-700">{isExpanded ? "Hide Full Feedback" : "View Full Feedback"}</span><span className="text-indigo-600 text-xl">{isExpanded ? "▲" : "▼"}</span></button></div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-6">
                      <section className="bg-white rounded-lg border border-gray-200 p-6"><h3 className="text-lg font-bold text-indigo-700 mb-5">Feedback Information</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {[ ["Assignment", feedback.assignmentName], ["Module", feedback.module], ["Student Name", feedback.studentName], ["Student ID", feedback.studentId], ["Created", formatDateTime(feedback.createdAt)], ["Status", getStatusText(feedback.status)] ].map(([label, value]) => <div key={label}><p className="text-xs font-semibold text-gray-500 uppercase">{label}</p><p className="text-gray-800 font-medium mt-1">{value || "Not available"}</p></div>)}
                      </div></section>
                      {renderInfoCard("Assignment Questions", feedback.assignmentQuestions, "No assignment questions available.")}
                      {renderInfoCard("Question Specification", feedback.questionSpecification, "No question specification available.")}
                      {renderInfoCard("Marking Rubric", feedback.markingRubric, "No marking rubric available.")}
                      {renderInfoCard("Student Answer", feedback.studentAnswer, "No student answer available.", true)}

                      <section className="bg-indigo-600 rounded-lg p-5"><h3 className="text-xl font-bold text-white">AI Analysis</h3><p className="text-indigo-100 text-sm mt-1">Automatically generated analysis of the student's submission.</p></section>
                      {[ ["Strengths", analysis.strengths, "text-green-700", "No strengths identified."], ["Coding Errors", analysis.codingErrors, "text-red-600", "No coding errors identified."], ["Logical Weaknesses", analysis.logicalWeaknesses, "text-orange-600", "No logical weaknesses identified."], ["Missing Requirements", analysis.missingRequirements, "text-purple-700", "No missing requirements identified."], ["Improvement Suggestions", analysis.improvementSuggestions, "text-blue-700", "No improvement suggestions available."] ].map(([title, items, color, empty]) => <section key={title} className="bg-white rounded-lg border border-gray-200 p-6"><h3 className={`text-lg font-bold ${color} mb-4`}>{title}</h3>{renderList(items, empty)}</section>)}

                      <section className="bg-white rounded-lg border border-gray-200 p-6"><h3 className="text-lg font-bold text-indigo-700 mb-5">AI Rubric-Based Marks</h3>{rubricMarks.length ? <div className="overflow-x-auto"><table className="w-full min-w-[700px] border-collapse"><thead><tr className="bg-indigo-50">{["Criterion", "Maximum", "Suggested", "Reason"].map((heading) => <th key={heading} className="border border-gray-200 px-4 py-3 text-left text-sm font-bold">{heading}</th>)}</tr></thead><tbody>{rubricMarks.map((item, i) => <tr key={i} className="hover:bg-gray-50"><td className="border border-gray-200 px-4 py-3 font-semibold">{item?.criterion || "—"}</td><td className="border border-gray-200 px-4 py-3 text-center">{item?.maximumMarks ?? "—"}</td><td className="border border-gray-200 px-4 py-3 text-center"><span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold">{item?.suggestedMarks ?? "—"}</span></td><td className="border border-gray-200 px-4 py-3">{item?.reason || "No reason provided."}</td></tr>)}</tbody></table></div> : <p className="text-gray-500">No rubric marks available.</p>}</section>

                      <section className="bg-indigo-50 border border-indigo-200 rounded-lg p-6"><div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5"><div><h3 className="text-lg font-bold text-indigo-800">AI Suggested Total</h3><p className="text-sm text-indigo-600 mt-1">Suggested mark based on the provided rubric.</p></div><div className="bg-white rounded-lg px-8 py-4 text-center"><p className="text-4xl font-bold text-indigo-700">{typeof feedback.suggestedTotal === "number" ? feedback.suggestedTotal : "—"}</p></div></div></section>
                      {renderInfoCard("Personalized Academic Feedback", feedback.personalizedFeedback, "No personalized feedback available.")}

                      {feedback.status === "approved" && <>
                        <section className="bg-green-600 rounded-lg p-5"><h3 className="text-xl font-bold text-white">Lecturer-Approved Result</h3><p className="text-green-100 text-sm mt-1">Final reviewed and approved feedback.</p></section>
                        <section className="bg-white rounded-lg border border-green-200 p-6"><h3 className="text-lg font-bold text-green-700 mb-5">Approved Marks</h3>{approvedMarks.length ? <div className="overflow-x-auto"><table className="w-full min-w-[700px] border-collapse"><thead><tr className="bg-green-50">{["Criterion", "Maximum", "Final Marks", "Reason"].map((heading) => <th key={heading} className="border border-gray-200 px-4 py-3 text-left">{heading}</th>)}</tr></thead><tbody>{approvedMarks.map((item, i) => <tr key={i}><td className="border border-gray-200 px-4 py-3 font-semibold">{item?.criterion || "—"}</td><td className="border border-gray-200 px-4 py-3 text-center">{item?.maximumMarks ?? "—"}</td><td className="border border-gray-200 px-4 py-3 text-center font-bold text-green-700">{item?.finalMarks ?? "—"}</td><td className="border border-gray-200 px-4 py-3">{item?.reason || "—"}</td></tr>)}</tbody></table></div> : <p className="text-gray-500">No approved marks available.</p>}</section>
                        <section className="bg-green-50 border border-green-200 rounded-lg p-6"><div className="grid grid-cols-1 md:grid-cols-3 gap-5"><div><p className="text-sm text-gray-600">Final Total</p><p className="text-4xl font-bold text-green-700 mt-1">{typeof feedback.finalTotal === "number" ? feedback.finalTotal : "—"}</p></div><div><p className="text-sm text-gray-600">Bonus Marks</p><p className="text-3xl font-bold text-green-700 mt-1">{typeof feedback.bonusMarks === "number" ? `+${feedback.bonusMarks}` : "—"}</p></div><div><p className="text-sm text-gray-600">Approved At</p><p className="text-sm font-semibold text-gray-800 mt-2">{formatDateTime(feedback.approvedAt)}</p></div></div></section>
                        {feedback.approvedFeedback && renderInfoCard("Approved Feedback", feedback.approvedFeedback)}
                        {feedback.lecturerComment && renderInfoCard("Lecturer Comment", feedback.lecturerComment)}
                      </>}

                      <div className="bg-gray-100 rounded-lg p-4"><p className="text-xs text-gray-500">Feedback Record ID</p><p className="text-xs font-mono text-gray-700 mt-1 break-all">{feedback._id || "Not available"}</p></div>
                      <button type="button" onClick={() => toggleRecord(feedback._id)} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-md transition">Hide Full Feedback</button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {!isLoading && !errorMessage && feedbackList.length > 0 && <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-5 mt-6"><h3 className="font-semibold text-indigo-800 mb-1">Human-in-the-Loop Review</h3><p className="text-sm text-indigo-700 leading-relaxed">AI-generated marks and feedback are provisional. The lecturer reviews the generated analysis, edits it where necessary, and approves the final result.</p></div>}
      </div>
    </div>
  );
};

export default FeedbackHistory;
