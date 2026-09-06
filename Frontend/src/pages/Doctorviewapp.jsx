import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, User, Mail, Phone, ExternalLink, CalendarCheck } from "lucide-react";

const groupByDate = (appointments) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const today = [];
  const upcoming = [];
  const past = [];

  [...appointments]
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
    .forEach((app) => {
      const dt = new Date(`${app.date}T${app.time}`);
      if (dt >= startOfToday && dt < startOfTomorrow) today.push(app);
      else if (dt >= startOfTomorrow) upcoming.push(app);
      else past.push(app);
    });

  return { today, upcoming, past: past.reverse() };
};

const Doctorviewapp = () => {
  const [appointments, setappointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + "/doctorviewapp", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("emstoken")}`,
        },
        withCredentials: true,
      });
      setappointments(response.data.appointments || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const isTimeReached = (date, time) => {
    const now = new Date();
    return now >= new Date(`${date}T${time}`);
  };

  const groups = useMemo(() => groupByDate(appointments), [appointments]);

  return (
    <div className="h-full overflow-y-auto bg-slate-50 px-6 py-10 md:px-10">
      <div className="motion-safe:animate-[fadeInUp_0.4s_ease-out_both] mb-10">
        <p className="text-[10px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-1">Doctor Portal</p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          My <span className="text-indigo-600">Appointments</span>
        </h1>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40">
          <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
          <p className="mt-4 text-slate-400 text-sm font-medium">Loading appointments...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white border border-slate-100 rounded-3xl">
          <CalendarCheck size={48} className="text-slate-200 mb-4" strokeWidth={1.5} />
          <h3 className="text-lg font-bold text-slate-700">No Appointments Yet</h3>
          <p className="text-slate-400 text-sm mt-1">Patient appointments will appear here.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {groups.today.length > 0 && (
            <AppointmentSection title="Today" badgeClass="bg-emerald-50 text-emerald-600" appointments={groups.today} isTimeReached={isTimeReached} />
          )}
          {groups.upcoming.length > 0 && (
            <AppointmentSection title="Upcoming" badgeClass="bg-indigo-50 text-indigo-600" appointments={groups.upcoming} isTimeReached={isTimeReached} />
          )}
          {groups.past.length > 0 && (
            <AppointmentSection title="Past" badgeClass="bg-slate-100 text-slate-500" appointments={groups.past} isTimeReached={isTimeReached} />
          )}
        </div>
      )}
    </div>
  );
};

const AppointmentSection = ({ title, badgeClass, appointments, isTimeReached }) => (
  <div>
    <div className="flex items-center gap-2.5 mb-4">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">{title}</p>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>{appointments.length}</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {appointments.map((app, i) => (
        <AppointmentCard key={app._id} app={app} active={isTimeReached(app.date, app.time)} index={i} />
      ))}
    </div>
  </div>
);

const AppointmentCard = ({ app, active, index = 0 }) => {
  const navigate = useNavigate();

  return (
  <div
    style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    className="motion-safe:animate-[fadeInUp_0.45s_ease-out_both] bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:shadow-indigo-50/50 transition-all duration-300 flex flex-col"
  >
    <div className="flex items-center justify-between mb-5">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Appointment</span>
      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
        active ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-500"
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-500 animate-pulse" : "bg-slate-400"}`} />
        {active ? "Ready" : "Upcoming"}
      </span>
    </div>

    <div className="mb-5">
      <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">Patient</p>
      <h3 className="font-bold text-slate-800 text-base leading-tight">{app.name}</h3>
    </div>

    <div className="space-y-2.5 flex-1">
      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"><Calendar size={15} /></div>
        <div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">Date</p>
          <p className="text-sm font-bold text-slate-700">
            {new Date(app.date).toLocaleDateString(undefined, { dateStyle: "long" })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"><Clock size={15} /></div>
        <div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">Time</p>
          <p className="text-sm font-bold text-slate-700">{app.time}</p>
        </div>
      </div>

      <div className="space-y-1.5 p-3 bg-slate-50 rounded-2xl">
        {app.email && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Mail size={12} className="text-slate-400 shrink-0" />
            <span className="truncate">{app.email}</span>
          </div>
        )}
        {app.contact && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Phone size={12} className="text-slate-400 shrink-0" />
            <span>{app.contact}</span>
          </div>
        )}
      </div>

      {app.description && (
        <div className="p-3 bg-slate-50 rounded-2xl">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reason for Visit</p>
          <p className="text-xs text-slate-600 italic line-clamp-2">"{app.description}"</p>
        </div>
      )}
    </div>

    <button
      disabled={!active}
      onClick={() => active && navigate(`/meeting/${app._id}`)}
      className={`mt-5 w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2
        ${active
          ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 active:scale-[0.98]"
          : "bg-slate-100 text-slate-400 cursor-not-allowed"
        }`}
    >
      {active ? (<>Start Appointment <ExternalLink size={15} /></>) : "Waiting for Time"}
    </button>
  </div>
  );
};

export default Doctorviewapp;
