import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck, ChevronRight, Calendar, Clock,
  Users, ExternalLink, ArrowRight, AlertCircle, RefreshCw,
} from 'lucide-react';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const Docterdashboard = () => {
  const [data, setData] = useState({ email: "", name: "", contact: "", address: "" });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    setError("");
    await Promise.all([fetchDashboard(), fetchAppointments()]);
    setLoading(false);
  };

  const fetchDashboard = async () => {
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
      setError("Couldn't load your profile. Please try again.");
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
      setError("Couldn't load your appointments. Please try again.");
    }
  };

  const now = new Date();
  const todayKey = now.toISOString().slice(0, 10);
  const isTimeReached = (date, time) => now >= new Date(`${date}T${time}`);
  const todaysSchedule = appointments
    .filter((a) => new Date(a.date).toISOString().slice(0, 10) === todayKey)
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
  const readyNow = appointments.filter((a) => isTimeReached(a.date, a.time));

  return (
    <div className="h-full overflow-y-auto bg-slate-50 px-6 py-10 md:px-10">
      {error && (
        <div className="motion-safe:animate-[fadeInUp_0.4s_ease-out_both] mb-6 flex items-center justify-between gap-4 bg-red-50 border border-red-100 rounded-2xl px-5 py-4">
          <div className="flex items-center gap-3">
            <AlertCircle size={18} className="text-red-500 shrink-0" />
            <p className="text-sm font-semibold text-red-700">{error}</p>
          </div>
          <button
            onClick={loadAll}
            className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-red-700 hover:text-red-800 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
          >
            <RefreshCw size={13} /> Retry
          </button>
        </div>
      )}

      <div className="motion-safe:animate-[fadeInUp_0.5s_ease-out_both] flex items-center justify-between mb-8">
        {loading ? (
          <div className="h-10 w-72 bg-slate-200/70 rounded-lg animate-pulse" />
        ) : (
          <div>
            <p className="text-[10px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-1">
              Doctor Portal
            </p>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
              {getGreeting()}, <span className="text-indigo-600">Dr. {data.name?.split(" ")[0] || "Doctor"}</span>
            </h1>
          </div>
        )}
        {loading ? (
          <div className="w-12 h-12 rounded-2xl bg-slate-200/70 animate-pulse shrink-0" />
        ) : (
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0">
            {data.name?.charAt(0)?.toUpperCase() || "D"}
          </div>
        )}
      </div>

      {/* Stat row */}
      <div
        className="motion-safe:animate-[fadeInUp_0.5s_ease-out_both] grid grid-cols-3 gap-4 mb-8 max-w-3xl"
        style={{ animationDelay: '80ms' }}
      >
        {loading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <StatCard icon={<Calendar size={16} />} label="Today" value={todaysSchedule.length} />
            <StatCard icon={<Users size={16} />} label="Total Patients" value={appointments.length} />
            <StatCard icon={<CalendarCheck size={16} />} label="Ready Now" value={readyNow.length} accent />
          </>
        )}
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
            badge={!loading && todaysSchedule.length > 0 ? todaysSchedule.length : null}
          />
        </div>

        <div
          className="motion-safe:animate-[fadeInUp_0.5s_ease-out_both] space-y-6"
          style={{ animationDelay: '220ms' }}
        >
          {loading ? (
            <WidgetSkeleton />
          ) : (
            <TodaysScheduleCard
              schedule={todaysSchedule}
              isTimeReached={isTimeReached}
              onViewAll={() => navigate('/doctorviewapp')}
            />
          )}
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
    <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{label}</p>
  </div>
);

const StatSkeleton = () => (
  <div className="bg-white border border-slate-100 rounded-2xl p-4">
    <div className="w-8 h-8 rounded-lg bg-slate-100 animate-pulse mb-3" />
    <div className="h-6 w-8 bg-slate-200/70 rounded animate-pulse mb-2" />
    <div className="h-2.5 w-16 bg-slate-100 rounded animate-pulse" />
  </div>
);

const WidgetSkeleton = () => (
  <div className="bg-white border border-slate-100 rounded-3xl p-6">
    <div className="h-2.5 w-28 bg-slate-100 rounded animate-pulse mb-5" />
    <div className="space-y-2.5">
      <div className="h-11 bg-slate-50 rounded-xl animate-pulse" />
      <div className="h-11 bg-slate-50 rounded-xl animate-pulse" />
    </div>
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
                className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
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

const ActionButton = ({ title, description, icon, onClick, badge }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between px-6 py-5 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 hover:shadow-md transition-all duration-300 group"
  >
    <div className="flex items-center gap-4">
      <div className="p-3 bg-indigo-50 rounded-xl group-hover:scale-105 transition-transform duration-300">{icon}</div>
      <div className="text-left">
        <p className="font-bold text-slate-800 tracking-tight text-sm">{title}</p>
        {description && <p className="text-slate-400 text-xs mt-0.5">{description}</p>}
      </div>
    </div>
    <div className="flex items-center gap-3 shrink-0">
      {badge ? (
        <span className="min-w-[22px] h-[22px] px-1.5 flex items-center justify-center bg-indigo-600 text-white text-[11px] font-bold rounded-full">
          {badge}
        </span>
      ) : null}
      <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
    </div>
  </button>
);

export default Docterdashboard;
