import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Calendar, Clock, User, Mail, Phone, ExternalLink } from "lucide-react"; // Optional: npm install lucide-react

const Doctorviewapp = () => {
  const [appointments, setappointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + "/doctorviewapp", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("emstoken")}`,
        },
        withCredentials: true,
      });
      setappointments(response.data.appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const isTimeReached = (date, time) => {
    const now = new Date();
    const appointmentDateTime = new Date(`${date}T${time}`);
    return now >= appointmentDateTime;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] bg-[radial-gradient(ellipse_at_top,_#f5f3ff,_#f8fafc)] p-6 md:p-10 font-sans">

      <div className="fixed top-[-10%] left-[-5%] w-96 h-96 bg-purple-200/30 blur-[100px] rounded-full -z-10" />
      <div className="fixed bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-200/30 blur-[100px] rounded-full -z-10" />

      <div className="max-w-6xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Aura<span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Health</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Doctor's Consultation Schedule</p>
          </div>
        </div>  


        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-20 bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white">
            <p className="text-slate-400 font-medium">No scheduled appointments found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((app) => {
              const active = isTimeReached(app.date, app.time);

              return (
                <div
                  key={app._id}
                  className="group bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white p-6 shadow-[0_20px_50px_-15px_rgba(147,51,234,0.08)] hover:shadow-[0_30px_60px_-15px_rgba(147,51,234,0.15)] transition-all duration-300 hover:-translate-y-1"
                >

                  <div className="flex justify-between items-start mb-6">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      active ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {active ? '● Ready to Start' : '○ Upcoming'}
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Patient</p>
                        <p className="text-slate-800 font-bold">{app.name}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar size={14} className="text-purple-400" />
                        <span className="text-xs font-medium">{new Date(app.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock size={14} className="text-purple-400" />
                        <span className="text-xs font-medium">{app.time}</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-50">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Mail size={14} /> <span>{app.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Phone size={14} /> <span>{app.contact}</span>
                      </div>
                    </div>

                    {app.description && (
                      <div className="mt-4 p-3 bg-slate-50 rounded-xl">
                         <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Reason for Visit</p>
                         <p className="text-xs text-slate-600 line-clamp-2 italic">"{app.description}"</p>
                      </div>
                    )}
                  </div>

                  <button
                    disabled={!active}
                    className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg 
                      ${active 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 shadow-purple-200 active:scale-95' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                      }`}
                  >
                    {active ? (
                      <>
                        Start Appointment <ExternalLink size={16} />
                      </>
                    ) : (
                      "Waiting for Time"
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctorviewapp;