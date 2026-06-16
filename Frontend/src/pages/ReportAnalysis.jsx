import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const ReportAnalysis = () => {
  const [reports, setReports] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const authHeaders = { Authorization: `Bearer ${Cookies.get("token")}` };

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/report`, {
        headers: authHeaders,
        withCredentials: true,
      });
      setReports(res.data.reports);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const openReport = async (id) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/report?id=${id}`, {
        headers: authHeaders,
        withCredentials: true,
      });
      setActiveReport(res.data.report);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_BASE_URL}/report`, formData, {
        headers: { ...authHeaders, "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setActiveReport(res.data.report);
      fetchReports();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to analyze report.");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!text.trim() || !activeReport) return;

    const userMsg = { role: "user", text };
    setActiveReport((prev) => ({ ...prev, messages: [...prev.messages, userMsg] }));
    setText("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/report`,
        { text: userMsg.text, reportId: activeReport._id },
        { headers: authHeaders, withCredentials: true }
      );
      setActiveReport((prev) => ({
        ...prev,
        messages: [...prev.messages, { role: "bot", text: res.data.text }],
      }));
    } catch (err) {
      setActiveReport((prev) => ({
        ...prev,
        messages: [...prev.messages, { role: "bot", text: "Something went wrong" }],
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] bg-[radial-gradient(ellipse_at_top,_#eff6ff,_#f8fafc)] font-sans py-12 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Past reports sidebar */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-white shadow-[0_30px_60px_-15px_rgba(30,64,175,0.08)] p-6">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Reports</h3>

          <label className="block mb-4 cursor-pointer text-center px-4 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors">
            {loading ? "Uploading..." : "+ New Report"}
            <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" disabled={loading} />
          </label>

          {error && (
            <div className="mb-4 p-2 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            {reports.length === 0 && <p className="text-slate-400 text-sm">No reports yet.</p>}
            {reports.map((r) => (
              <button
                key={r._id}
                onClick={() => openReport(r._id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeReport?._id === r._id
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-blue-50/40"
                }`}
              >
                {r.title}
              </button>
            ))}
          </div>
        </div>

        {/* Chat window */}
        <div className="md:col-span-2 bg-white/70 backdrop-blur-2xl rounded-3xl border border-white shadow-[0_30px_60px_-15px_rgba(30,64,175,0.08)] p-6 flex flex-col h-[75vh]">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-4">
            Report <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Chat</span>
          </h1>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {!activeReport && (
              <p className="text-slate-400 text-sm">Upload a PDF or pick a report to start chatting.</p>
            )}
            {activeReport?.messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <span
                  className={`inline-block max-w-[80%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${
                    msg.role === "user" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            {loading && activeReport && <p className="text-xs text-slate-400">Typing...</p>}
          </div>

          {activeReport && (
            <div className="flex gap-2 mt-4">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about this report..."
                className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="px-6 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportAnalysis;
