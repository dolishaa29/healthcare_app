import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Send, ArrowLeft } from "lucide-react";
import { getSocket } from "../socket";

const getInitials = (name = "") => {
  if (name.includes("@")) return name.split("@")[0].slice(0, 2).toUpperCase();
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "??";
};

const formatTime = (ts) => {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDateLabel = (ts) => {
  if (!ts) return null;
  const msgDate = new Date(ts);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (msgDate.toDateString() === today.toDateString()) return "Today";
  if (msgDate.toDateString() === yesterday.toDateString()) return "Yesterday";
  return msgDate.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
};

const groupByDate = (messages) => {
  const result = [];
  let lastLabel = null;

  for (const msg of messages) {
    const label = formatDateLabel(msg.createdAt || msg.timestamp);
    if (label && label !== lastLabel) {
      result.push({ type: "divider", label });
      lastLabel = label;
    }
    result.push({ type: "message", data: msg });
  }

  return result;
};

const ChatWindow = ({ role, token, userId, doctorId, otherName, otherColor, otherRole, historyUrl, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const bottomRef = useRef(null);
  const socketRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    let active = true;

    const loadHistory = async () => {
      setLoading(true);
      try {
        const res = await axios.get(historyUrl, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        if (active) setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Failed to load chat history:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadHistory();

    const socket = getSocket(token, role);
    socketRef.current = socket;
    socket.emit("joinConversation", { userId, doctorId });

    const onNewMessage = (message) => {
      const isThisConversation =
        message.userId === userId && message.doctorId === doctorId;
      if (isThisConversation) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("receiveMessage", onNewMessage);

    return () => {
      active = false;
      socket.off("receiveMessage", onNewMessage);
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
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSend(e);
    }
  };

  const grouped = groupByDate(messages);
  const avatarColor = otherColor || "from-violet-500 to-indigo-500";
  const displayLabel = otherRole || (role === "user" ? "Doctor" : "Patient");
  const displayName = otherName?.includes("@") ? otherName.split("@")[0] : otherName;

  return (
    <div className="flex flex-col h-full bg-white">

      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-white shrink-0">
        {onBack && (
          <button onClick={onBack} className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 shrink-0">
            <ArrowLeft size={18} />
          </button>
        )}

        <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center bg-linear-to-br ${avatarColor} shadow-sm`}>
          <span className="text-white text-xs font-bold">{getInitials(otherName)}</span>
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold text-slate-800 truncate">{displayName}</h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            <p className="text-[11px] text-slate-400 font-medium">{displayLabel}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1 bg-slate-50">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-7 h-7 border-[3px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-16 text-center">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-linear-to-br ${avatarColor} shadow mb-3`}>
              <span className="text-white text-lg font-bold">{getInitials(otherName)}</span>
            </div>
            <p className="text-slate-600 font-semibold text-sm">{displayName}</p>
            <p className="text-slate-400 text-xs mt-1">No messages yet — say hello!</p>
          </div>
        ) : (
          grouped.map((item, i) =>
            item.type === "divider" ? (
              <div key={`d-${i}`} className="flex items-center gap-3 py-2">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {item.label}
                </span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
            ) : (
              <MessageBubble
                key={item.data._id || i}
                m={item.data}
                role={role}
                otherName={otherName}
                color={avatarColor}
              />
            )
          )
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSend}
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
          placeholder="Type a message…"
          className="flex-1 resize-none overflow-hidden px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all leading-relaxed"
          style={{ minHeight: "42px", maxHeight: "120px" }}
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

const MessageBubble = ({ m, role, otherName, color }) => {
  const isSelf = m.senderRole === role;
  const time = formatTime(m.createdAt || m.timestamp);

  return (
    <div className={`flex items-end gap-2 ${isSelf ? "flex-row-reverse" : "flex-row"}`}>
      {!isSelf && (
        <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center bg-linear-to-br ${color} shadow-sm mb-0.5`}>
          <span className="text-white text-[10px] font-bold">
            {(otherName || "").split("@")[0].slice(0, 2).toUpperCase()}
          </span>
        </div>
      )}

      <div className={`flex flex-col gap-0.5 max-w-[65%] ${isSelf ? "items-end" : "items-start"}`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isSelf
              ? "bg-indigo-600 text-white rounded-br-sm"
              : "bg-white text-slate-800 border border-slate-100 shadow-sm rounded-bl-sm"
          }`}
        >
          {m.text}
        </div>
        {time && <span className="text-[10px] text-slate-400 px-1">{time}</span>}
      </div>
    </div>
  );
};

export default ChatWindow;
