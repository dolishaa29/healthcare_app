import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Send, ArrowLeft } from "lucide-react";
import { getSocket } from "../socket";

const ChatWindow = ({ role, token, userId, doctorId, otherName, historyUrl, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    let active = true;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await axios.get(historyUrl, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        if (active) setMessages(res.data.messages || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchHistory();

    const socket = getSocket(token, role);
    socketRef.current = socket;
    socket.emit("joinConversation", { userId, doctorId });

    const handleReceive = (message) => {
      if (message.userId === userId && message.doctorId === doctorId) {
        setMessages((prev) => [...prev, message]);
      }
    };
    socket.on("receiveMessage", handleReceive);

    return () => {
      active = false;
      socket.off("receiveMessage", handleReceive);
    };
  }, [userId, doctorId, role, token, historyUrl]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    socketRef.current?.emit("sendMessage", { userId, doctorId, text });
    setText("");
  };

  return (
    <div className="flex flex-col h-[78vh] w-full bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-white/60 shrink-0">
        {onBack && (
          <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
            <ArrowLeft size={18} />
          </button>
        )}
        <div>
          <p className="text-[10px] font-bold text-purple-500 uppercase tracking-widest">Chatting with</p>
          <h2 className="text-lg font-extrabold text-slate-800">{otherName}</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-10">No messages yet. Say hello!</p>
        ) : (
          messages.map((m) => (
            <div key={m._id} className={`flex ${m.senderRole === role ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm font-medium ${
                  m.senderRole === role
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-3 px-6 py-4 border-t border-slate-100 bg-white/60 shrink-0">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400"
        />
        <button
          type="submit"
          className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:opacity-90 transition-all active:scale-95"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
