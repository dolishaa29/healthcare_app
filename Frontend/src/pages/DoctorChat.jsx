import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { MessageCircle, User } from "lucide-react";
import ChatWindow from "../components/ChatWindow";

const DoctorChat = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

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

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] bg-[radial-gradient(ellipse_at_top,_#f5f3ff,_#f8fafc)] font-sans p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-8">
          Mess<span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">ages</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] p-4 h-[78vh] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <MessageCircle size={36} className="text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium text-sm">No conversations yet.</p>
                <p className="text-slate-400 text-xs mt-1">Approved appointments will show up here.</p>
              </div>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.userId}
                  onClick={() => setActive(c)}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl text-left transition-all ${
                    active?.userId === c.userId ? "bg-purple-50 border border-purple-200" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                    <User size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-sm truncate">{c.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest truncate">{c.email}</p>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="md:col-span-2">
            {active ? (
              <ChatWindow
                role="doctor"
                token={token}
                userId={active.userId}
                doctorId={active.doctorId}
                otherName={active.name}
                historyUrl={`${API_BASE_URL}/chat/doctor/history/${active.userId}`}
              />
            ) : (
              <div className="h-[78vh] flex items-center justify-center bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/50 border-dashed">
                <p className="text-slate-400 font-medium">Select a conversation to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorChat;
