import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { FileText, Upload, Send, Loader2, Bot, Sparkles, ArrowLeft, TrendingUp, Trash2 } from "lucide-react";

const ReportAnalysis = () => {
  const [reports, setReports] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [trendsText, setTrendsText] = useState(null);
  const [trendsLoading, setTrendsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const authHeaders = { Authorization: `Bearer ${Cookies.get("token")}` };

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/report`, {
        headers: authHeaders,
        withCredentials: true,
      });
      setReports(res.data.reports || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeReport?.messages]);

  const openReport = async (id) => {
    setTrendsText(null);
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

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this report? This can't be undone.")) return;
    setDeletingId(id);
    try {
      await axios.delete(`${API_BASE_URL}/report/${id}`, {
        headers: authHeaders,
        withCredentials: true,
      });
      setReports((prev) => prev.filter((r) => r._id !== id));
      if (activeReport?._id === id) setActiveReport(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete report.");
    } finally {
      setDeletingId(null);
    }
  };

  const viewTrends = async () => {
    setActiveReport(null);
    setTrendsLoading(true);
    setTrendsText(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/report/trends`, {
        headers: authHeaders,
        withCredentials: true,
      });
      setTrendsText(res.data.text);
    } catch {
      setTrendsText("Failed to load health trends. Please try again.");
    } finally {
      setTrendsLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
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
      setUploading(false);
      e.target.value = "";
    }
  };

  const sendMessage = async () => {
    if (!text.trim() || !activeReport || loading) return;
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
    } catch {
      setActiveReport((prev) => ({
        ...prev,
        messages: [...prev.messages, { role: "bot", text: "Something went wrong. Please try again." }],
      }));
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const showingDetail = !!activeReport || trendsLoading || trendsText !== null;

  return (
    <div className="flex h-full overflow-hidden bg-white">
      {/* Sidebar */}
      <aside
        className={`w-full md:w-72 shrink-0 flex-col border-r border-slate-100 bg-white ${
          showingDetail ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Header */}
        <div className="px-4 pt-5 pb-3 border-b border-slate-100">
          <p className="text-[10px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-0.5">
            AI-Powered
          </p>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight mb-3">
            Report Analysis
          </h1>

          {/* Upload button */}
          <label
            className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border-2 border-dashed ${
              uploading
                ? "border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50"
                : "border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
            }`}
          >
            {uploading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Analyzing…
              </>
            ) : (
              <>
                <Upload size={14} />
                Upload PDF
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>

          <button
            onClick={viewTrends}
            disabled={reports.length < 2 || trendsLoading}
            className="flex items-center justify-center gap-2 w-full py-2 mt-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <TrendingUp size={13} />
            View Health Trends
          </button>

          {error && (
            <p className="mt-2 text-[11px] text-red-500 font-medium text-center">
              {error}
            </p>
          )}
        </div>

        {/* Report list */}
        <div className="flex-1 overflow-y-auto py-2 px-2">
          {reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12">
              <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                <FileText size={18} className="text-slate-300" strokeWidth={1.5} />
              </div>
              <p className="text-slate-500 font-semibold text-sm">No reports yet</p>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Upload a PDF to get started.
              </p>
            </div>
          ) : (
            reports.map((r, i) => {
              const isActive = activeReport?._id === r._id;
              return (
                <div
                  key={r._id}
                  style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
                  className={`group motion-safe:animate-[fadeInUp_0.35s_ease-out_both] w-full flex items-center gap-1 rounded-xl transition-all mb-0.5 ${
                    isActive
                      ? "bg-indigo-600 shadow-sm shadow-indigo-200"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <button
                    onClick={() => openReport(r._id)}
                    className="flex-1 min-w-0 flex items-center gap-3 px-3 py-2.5 rounded-xl text-left"
                  >
                    <div
                      className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center ${
                        isActive ? "bg-white/20" : "bg-indigo-50"
                      }`}
                    >
                      <FileText
                        size={15}
                        className={isActive ? "text-white" : "text-indigo-500"}
                      />
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`font-semibold text-sm truncate ${
                          isActive ? "text-white" : "text-slate-800"
                        }`}
                      >
                        {r.title}
                      </p>
                      <p
                        className={`text-[11px] mt-0.5 ${
                          isActive ? "text-indigo-200" : "text-slate-400"
                        }`}
                      >
                        {r.messages?.length ?? 0} messages
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, r._id)}
                    disabled={deletingId === r._id}
                    title="Delete report"
                    className={`shrink-0 w-8 h-8 mr-1.5 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all disabled:opacity-60 ${
                      isActive ? "text-white/70 hover:bg-white/20 hover:text-white" : "text-slate-300 hover:bg-red-50 hover:text-red-500"
                    }`}
                  >
                    {deletingId === r._id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* Main chat area */}
      <main className={`flex-1 min-w-0 overflow-hidden ${showingDetail ? "flex" : "hidden md:flex"} flex-col bg-white`}>
        {trendsLoading || trendsText !== null ? (
          <>
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 shrink-0">
              <button
                onClick={() => setTrendsText(null)}
                className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 shrink-0"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center bg-linear-to-br from-violet-500 to-indigo-600 shadow-sm">
                <TrendingUp size={16} className="text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-slate-800 truncate">Health Trends</h2>
                <p className="text-[11px] text-slate-400 font-medium">Across all your reports</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6 bg-slate-50">
              {trendsLoading ? (
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Loader2 size={16} className="animate-spin" /> Analyzing your report history…
                </div>
              ) : (
                <div className="max-w-2xl px-4 py-3 bg-white border border-slate-100 shadow-sm rounded-2xl text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {trendsText}
                </div>
              )}
            </div>
          </>
        ) : activeReport ? (
          <>
            {/* Chat header */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 shrink-0">
              <button
                onClick={() => setActiveReport(null)}
                className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 shrink-0"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center bg-linear-to-br from-violet-500 to-indigo-600 shadow-sm">
                <Sparkles size={16} className="text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-slate-800 truncate">
                  {activeReport.title}
                </h2>
                <p className="text-[11px] text-slate-400 font-medium">AI Health Assistant</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1 bg-slate-50">
              {activeReport.messages?.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-linear-to-br from-violet-500 to-indigo-600 shadow mb-3">
                    <Sparkles size={22} className="text-white" />
                  </div>
                  <p className="text-slate-600 font-semibold text-sm">Report uploaded!</p>
                  <p className="text-slate-400 text-xs mt-1">Ask anything about this report.</p>
                </div>
              ) : (
                activeReport.messages.map((msg, i) => (
                  <MessageBubble key={i} msg={msg} />
                ))
              )}

              {loading && (
                <div className="flex items-end gap-2">
                  <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center bg-linear-to-br from-violet-500 to-indigo-600">
                    <Sparkles size={11} className="text-white" />
                  </div>
                  <div className="px-4 py-3 bg-white border border-slate-100 shadow-sm rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
              className="flex items-end gap-3 px-5 py-3.5 border-t border-slate-100 bg-white shrink-0"
            >
              <textarea
                ref={inputRef}
                rows={1}
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask about this report…"
                className="flex-1 resize-none overflow-hidden px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all leading-relaxed"
                style={{ minHeight: "42px", maxHeight: "120px" }}
              />
              <button
                type="submit"
                disabled={loading || !text.trim()}
                className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-slate-50">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-4">
              <FileText size={24} className="text-slate-300" strokeWidth={1.5} />
            </div>
            <p className="text-slate-600 font-semibold">Select a report</p>
            <p className="text-slate-400 text-sm mt-1">
              Choose a report from the list or upload a new PDF
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

const MessageBubble = ({ msg }) => {
  const isUser = msg.role === "user";
  return (
    <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center bg-linear-to-br from-violet-500 to-indigo-600 mb-0.5">
          <Sparkles size={11} className="text-white" />
        </div>
      )}
      <div className={`max-w-[65%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? "bg-indigo-600 text-white rounded-br-sm"
              : "bg-white text-slate-800 border border-slate-100 shadow-sm rounded-bl-sm"
          }`}
        >
          {msg.text}
        </div>
      </div>
    </div>
  );
};

export default ReportAnalysis;
