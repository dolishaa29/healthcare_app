import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { MessageCircle, Search, User } from "lucide-react";
import ChatWindow from "../components/ChatWindow";

const getInitials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "P";

const avatarColors = [
  "from-violet-500 to-indigo-500",
  "from-sky-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-500",
];

const getAvatarColor = (id = "") =>
  avatarColors[id.charCodeAt(id.length - 1) % avatarColors.length];

const DoctorChat = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [search, setSearch] = useState("");

  const token = Cookies.get("emstoken");
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/chat/doctor/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setConversations(res.data.conversations || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [API_BASE_URL, token]);

  const filtered = conversations.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full overflow-hidden bg-white">
      {/* Sidebar */}
      <aside
        className={`w-full md:w-72 shrink-0 flex-col border-r border-slate-100 bg-white ${
          active ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="px-4 pt-5 pb-3 border-b border-slate-100">
          <p className="text-[10px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-0.5">Inbox</p>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight mb-3">Messages</h1>
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
            <Search size={13} className="text-slate-400 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patients…"
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2 px-2">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-[3px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12">
              <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                <MessageCircle size={18} className="text-slate-300" strokeWidth={1.5} />
              </div>
              <p className="text-slate-500 font-semibold text-sm">
                {search ? "No results" : "No conversations yet"}
              </p>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                {search ? "Try a different name." : "Approved appointments will appear here."}
              </p>
            </div>
          ) : (
            filtered.map((c, i) => {
              const isActive = active?.userId === c.userId;
              const color = getAvatarColor(c.userId);
              return (
                <button
                  key={c.userId}
                  onClick={() => setActive(c)}
                  style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
                  className={`motion-safe:animate-[fadeInUp_0.35s_ease-out_both] w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all mb-0.5 ${
                    isActive ? "bg-indigo-600 shadow-sm shadow-indigo-200" : "hover:bg-slate-50"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center bg-linear-to-br ${color}`}>
                    <span className="text-white text-xs font-bold">{getInitials(c.name)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className={`font-semibold text-sm truncate ${isActive ? "text-white" : "text-slate-800"}`}>
                      {c.name || "Patient"}
                    </p>
                    <p className={`text-[11px] mt-0.5 ${isActive ? "text-indigo-200" : "text-slate-400"}`}>
                      <User size={10} className="inline mr-1 mb-0.5" />
                      Patient
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* Chat area */}
      <main className={`flex-1 min-w-0 overflow-hidden ${active ? "flex" : "hidden md:flex"} flex-col`}>
        {active ? (
          <ChatWindow
            role="doctor"
            token={token}
            userId={active.userId}
            doctorId={active.doctorId}
            otherName={active.name}
            otherColor={getAvatarColor(active.userId)}
            otherRole="Patient"
            historyUrl={`${API_BASE_URL}/chat/doctor/history/${active.userId}`}
            onBack={() => setActive(null)}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-slate-50">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-4">
              <MessageCircle size={24} className="text-slate-300" strokeWidth={1.5} />
            </div>
            <p className="text-slate-600 font-semibold">Select a conversation</p>
            <p className="text-slate-400 text-sm mt-1">Choose a patient from the list to start chatting</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorChat;
