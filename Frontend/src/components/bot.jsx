import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { X, Send, Stethoscope, Sparkles } from "lucide-react";

const Bot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const sendMessage = async () => {
    if (!prompt.trim() || loading) return;
    const text = prompt.trim();
    setMessages((prev) => [...prev, { text, sender: "user" }]);
    setPrompt("");
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/chat`,
        { prompt: text },
        { headers: { Authorization: `Bearer ${Cookies.get("token")}` }, withCredentials: true }
      );
      setMessages((prev) => [...prev, { text: res.data.text, sender: "bot" }]);
    } catch {
      setMessages((prev) => [...prev, { text: "Sorry, I couldn't process that. Please try again.", sender: "bot" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">

      <div className={`mb-4 w-90 bg-white rounded-3xl shadow-2xl shadow-indigo-100 border border-slate-100 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right
        ${isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}
        style={{ maxHeight: "520px" }}
      >
        <div className="bg-linear-to-r from-indigo-600 to-violet-600 px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-2xl flex items-center justify-center">
              <Stethoscope size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-extrabold text-sm tracking-tight">AuraHealth Bot</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                <p className="text-indigo-200 text-[10px] font-semibold">Online · Ask me anything</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-all"
          >
            <X size={15} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ minHeight: "280px", maxHeight: "340px" }}>
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-full py-8 text-center">
              <div className="w-14 h-14 bg-linear-to-br from-indigo-50 to-violet-100 rounded-2xl flex items-center justify-center mb-3">
                <Sparkles size={22} className="text-indigo-400" />
              </div>
              <p className="text-slate-700 font-bold text-sm">How can I help you?</p>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed max-w-50">
                Ask me about symptoms, medications, or general health advice.
              </p>
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {["What are signs of diabetes?", "Tips for better sleep", "Common cold remedies"].map((q) => (
                  <button
                    key={q}
                    onClick={() => { setPrompt(q); inputRef.current?.focus(); }}
                    className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              {msg.sender === "bot" && (
                <div className="w-6 h-6 bg-linear-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center shrink-0 mr-2 mt-1 shadow-sm">
                  <Stethoscope size={11} className="text-white" />
                </div>
              )}
              <div
                className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                  ${msg.sender === "user"
                    ? "bg-linear-to-br from-indigo-600 to-violet-600 text-white rounded-br-md shadow-md shadow-indigo-100"
                    : "bg-slate-100 text-slate-700 rounded-bl-md"
                  }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-end gap-2">
              <div className="w-6 h-6 bg-linear-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                <Stethoscope size={11} className="text-white" />
              </div>
              <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 pb-4 pt-2 border-t border-slate-50 shrink-0">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all">
            <input
              ref={inputRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your health question..."
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={!prompt.trim() || loading}
              className="w-8 h-8 bg-linear-to-br from-indigo-600 to-violet-600 hover:opacity-90 disabled:opacity-30 text-white rounded-xl flex items-center justify-center transition-all active:scale-95 shrink-0"
            >
              <Send size={13} />
            </button>
          </div>
          <p className="text-[10px] text-slate-300 text-center mt-2">For informational purposes only · Not medical advice</p>
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-14 h-14 bg-linear-to-br from-indigo-600 to-violet-600 hover:opacity-90 text-white rounded-2xl shadow-xl shadow-indigo-200 flex items-center justify-center transition-all duration-300 active:scale-95
          ${isOpen ? "rotate-0" : "hover:scale-105"}`}
        title="AuraHealth Bot"
      >
        {isOpen
          ? <X size={22} />
          : <Stethoscope size={22} />
        }
      </button>
    </div>
  );
};

export default Bot;
