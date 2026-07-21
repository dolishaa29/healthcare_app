import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck, Loader2, ChevronRight, Calendar, Clock,
  Users, ExternalLink, ArrowRight,
} from 'lucide-react';

const Docterdashboard = () => {
  const [data, setData] = useState({ email: "", name: "", contact: "", address: "" });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
    fetchAppointments();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + "/doctordashboard", {
        headers: {
          Authorization: `Bearer ${Cookies.get("emstoken")}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (response.status === 200) setData(response.data.dashboard);
    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + "/doctorviewapp", {
        headers: {
          Authorization: `Bearer ${Cookies.get("emstoken")}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setAppointments(response.data.appointments || []);
    } catch (err) {
      console.error("Appointments Error:", err);
    }
  };

  if (loading) return (
    <div className="h-full w-full flex items-center justify-center bg-[#FDFBFF]">
      <Loader2 className="animate-spin text-indigo-600" size={35} />
    </div>
  );

  const now = new Date();
  const todayKey = now.toISOString().slice(0, 10);
  const isTimeReached = (date, time) => now >= new Date(`${date}T${time}`);
  const todaysSchedule = appointments
    .filter((a) => new Date(a.date).toISOString().slice(0, 10) === todayKey)
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
  const readyNow = appointments.filter((a) => isTimeReached(a.date, a.time));

  return (
    <div className="h-full overflow-y-auto bg-[#FDFBFF] px-6 py-10 md:px-10">
      <div className="motion-safe:animate-[fadeInUp_0.5s_ease-out_both] flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-1">
            Doctor Portal
          </p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            Welcome,{" "}
            <span className="bg-linear-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
              Dr. {data.name?.split(" ")[0] || "Doctor"}
            </span>
          </h1>
        </div>
        <div className="w-12 h-12 bg-linear-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-lg border border-indigo-100">
          {data.name?.charAt(0) || "D"}
        </div>
      </div>

      {/* Stat row */}
      <div
        className="motion-safe:animate-[fadeInUp_0.5s_ease-out_both] grid grid-cols-3 gap-4 mb-8 max-w-3xl"
        style={{ animationDelay: '80ms' }}
      >
        <StatCard icon={<Calendar size={16} />} label="Today" value={todaysSchedule.length} />
        <StatCard icon={<Users size={16} />} label="Total Patients" value={appointments.length} />
        <StatCard icon={<CalendarCheck size={16} />} label="Ready Now" value={readyNow.length} accent />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 max-w-5xl">
        <div
          className="motion-safe:animate-[fadeInUp_0.5s_ease-out_both] lg:col-span-2 space-y-4"
          style={{ animationDelay: '150ms' }}
        >
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Quick Actions</p>
          <ActionButton
            title="View Scheduled Appointments"
            description="Review your upcoming patient appointments"
            icon={<CalendarCheck size={20} className="text-indigo-600" />}
            onClick={() => navigate('/doctorviewapp')}
          />
        </div>

        <div
          className="motion-safe:animate-[fadeInUp_0.5s_ease-out_both] space-y-6"
          style={{ animationDelay: '220ms' }}
        >
          <TodaysScheduleCard
            schedule={todaysSchedule}
            isTimeReached={isTimeReached}
            onViewAll={() => navigate('/doctorviewapp')}
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, accent }) => (
  <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${accent ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
      {icon}
    </div>
    <p className="text-2xl font-black text-slate-900 leading-none">{value}</p>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{label}</p>
  </div>
);

const TodaysScheduleCard = ({ schedule, isTimeReached, onViewAll }) => (
  <div className="bg-white border border-slate-100 rounded-3xl p-6">
    <div className="flex items-center justify-between mb-5">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today's Schedule</p>
      <button onClick={onViewAll} className="text-indigo-600 hover:text-indigo-700 transition-colors">
        <ExternalLink size={14} />
      </button>
    </div>

    {schedule.length === 0 ? (
      <div className="text-center py-4">
        <p className="text-sm text-slate-400">No appointments scheduled today.</p>
      </div>
    ) : (
      <div className="space-y-3">
        {schedule.slice(0, 4).map((app) => {
          const ready = isTimeReached(app.date, app.time);
          return (
            <div key={app._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="min-w-0">
                <p className="font-bold text-slate-800 text-xs truncate">{app.name}</p>
                <div className="flex items-center gap-1.5 mt-1 text-slate-400">
                  <Clock size={11} />
                  <span className="text-[11px] font-bold">{app.time}</span>
                </div>
              </div>
              <span
                className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  ready ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-500"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${ready ? "bg-green-500 animate-pulse" : "bg-slate-400"}`} />
                {ready ? "Ready" : "Upcoming"}
              </span>
            </div>
          );
        })}
        <button
          onClick={onViewAll}
          className="w-full mt-2 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
        >
          View All Appointments <ArrowRight size={13} />
        </button>
      </div>
    )}
  </div>
);

const ActionButton = ({ title, description, icon, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between px-6 py-5 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group"
  >
    <div className="flex items-center gap-4">
      <div className="p-3 bg-indigo-50 rounded-xl group-hover:scale-105 transition-transform duration-300">{icon}</div>
      <div className="text-left">
        <p className="font-bold text-slate-800 tracking-tight text-sm">{title}</p>
        {description && <p className="text-slate-400 text-xs mt-0.5">{description}</p>}
      </div>
    </div>
    <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
  </button>
);

export default Docterdashboard;
