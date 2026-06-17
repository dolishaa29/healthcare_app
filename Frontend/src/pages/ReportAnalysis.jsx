import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { FileText, Upload, Send, Loader2, Bot, Sparkles } from "lucide-react";

const ReportAnalysis = () => {
  const [reports, setReports] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
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

  return (
    <div className="flex h-full overflow-hidden bg-white">
      {/* Sidebar */}
      <aside className="w-72 shrink-0 flex flex-col border-r border-slate-100 bg-white">
        {/* Header */}
        <div className="px-4 pt-5 pb-3 border-b border-slate-100">
          <p className="text-[10px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-0.5">
            AI-Powered
          </p>
          <h1 className="text-lg font-black text-slate-900 tracking-tight mb-3">
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
            reports.map((r) => {
              const isActive = activeReport?._id === r._id;
              return (
                <button
                  key={r._id}
                  onClick={() => openReport(r._id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all mb-0.5 ${
                    isActive
                      ? "bg-indigo-600 shadow-sm shadow-indigo-200"
                      : "hover:bg-slate-50"
                  }`}
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
              );
            })
          )}
        </div>
      </aside>

      {/* Main chat area */}
      <main className="flex-1 min-w-0 overflow-hidden flex flex-col bg-white">
        {activeReport ? (
          <>
            {/* Chat header */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 shrink-0">
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
