import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Calendar, Clock, Mail, Shield, ExternalLink, Activity, User } from 'lucide-react';

const Userviewapp = () => {
  const [appointments, setappointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + "/userviewapp", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        withCredentials: true,
      });
      setappointments(response.data.appointments || []);
    } catch (error) {
      console.log(error);
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
    <div className="relative min-h-screen w-full bg-[#f8fafc] font-sans text-slate-900 overflow-x-hidden">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-200/40 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-200/30 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-purple-600 rounded-lg shadow-lg shadow-purple-200">
                <Activity size={20} className="text-white" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Aura<span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Health</span>
              </h1>
            </div>
            <p className="text-slate-500 font-medium ml-1">Your Appointments</p>
          </div>

         
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
            <p className="mt-4 text-slate-500 font-medium animate-pulse">Syncing your schedule...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white/40 backdrop-blur-md rounded-[3rem] border border-white/50 border-dashed">
            <Calendar size={48} className="text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-800">No Appointments</h3>
            <p className="text-slate-500">You don't have any sessions booked.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {appointments.map((app) => {
              const active = isTimeReached(app.date, app.time);

              return (
                <div
                  key={app._id}
                  className="group relative bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white p-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(147,51,234,0.15)] transition-all duration-500 flex flex-col"
                >
                  <div className="absolute top-6 right-8">
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      active ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
                      {active ? 'Ready' : 'Pending'}
                    </span>
                  </div>

                  <div className="flex-grow">
                    <div className="mb-6">
                      <p className="text-[10px] font-bold text-purple-500 uppercase tracking-[0.2em] mb-1">Consulting Provider</p>
                      <h3 className="text-xl font-extrabold text-slate-800 group-hover:text-purple-700 transition-colors break-all">
                        {app.doctormail}
                      </h3>
                      <p className="text-[9px] text-slate-400 mt-1 font-mono uppercase">ID: {app.doctorid.slice(-8)}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-3 bg-white/50 rounded-2xl border border-white/50">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                          <Calendar size={18} />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter leading-none mb-1">Appointment Date</p>
                          <p className="text-sm font-bold text-slate-700">
                            {new Date(app.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-3 bg-white/50 rounded-2xl border border-white/50">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                          <Clock size={18} />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter leading-none mb-1">Time Slot</p>
                          <p className="text-sm font-bold text-slate-700">{app.time}</p>
                        </div>
                      </div>
                    </div>

                    {app.description && (
                      <div className="mt-6 p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reason / Notes</p>
                        <p className="text-xs text-slate-600 italic">"{app.description}"</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-8">
                    <button
                      disabled={!active}
                      className={`w-full group/btn relative overflow-hidden py-4 rounded-2xl font-bold text-sm transition-all duration-300 shadow-xl
                        ${active 
                          ? 'bg-slate-900 text-white hover:bg-purple-600 shadow-purple-200 active:scale-[0.98]' 
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                        }`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {active ? (
                          <>Start Appointment <ExternalLink size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" /></>
                        ) : (
                          "Waiting for Time"
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Userviewapp;