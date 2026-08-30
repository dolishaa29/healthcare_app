import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import {
  LayoutList, ChevronRight, Stethoscope, Video,
  CalendarClock, Calendar, Clock, ArrowRight, Lightbulb, ExternalLink,
  AlertCircle, RefreshCw,
} from 'lucide-react';
import HealthBot from '../components/bot';

const HEALTH_TIPS = [
  'Drinking a glass of water right after waking up kickstarts your metabolism for the day.',
  'Aim for at least 7-8 hours of sleep — it does more for immunity than any supplement.',
  'A 10-minute walk after meals can meaningfully improve blood sugar control.',
  'Book routine check-ups even when you feel fine — early detection saves treatment time.',
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const Userdashboard = () => {
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
      const response = await axios.get(import.meta.env.VITE_API_URL + "/userdashboard", {
        headers: { "Authorization": `Bearer ${Cookies.get("token")}` },
        withCredentials: true,
      });
      if (response.status === 200) setData(response.data.dashboard);
    } catch (err) {
      console.error(err);
      setError("Couldn't load your profile. Please try again.");
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + "/userviewapp", {
        headers: { "Authorization": `Bearer ${Cookies.get("token")}` },
        withCredentials: true,
      });
      setAppointments(response.data.appointments || []);
    } catch (err) {
      console.error(err);
      setError("Couldn't load your appointments. Please try again.");
    }
  };

  const now = new Date();
  const isTimeReached = (date, time) => now >= new Date(`${date}T${time}`);
  const upcoming = appointments
    .filter((a) => !isTimeReached(a.date, a.time))
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
  const readyNow = appointments.filter((a) => isTimeReached(a.date, a.time));
  const nextAppointment = upcoming[0];
  const tip = HEALTH_TIPS[new Date().getDate() % HEALTH_TIPS.length];

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

      {/* Header */}
      <div className="motion-safe:animate-[fadeInUp_0.5s_ease-out_both] flex items-center justify-between mb-8">
        {loading ? (
          <div className="h-10 w-72 bg-slate-200/70 rounded-lg animate-pulse" />
        ) : (
          <div>
            <p className="text-[10px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-1">
              Patient Portal
            </p>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
              {getGreeting()}, <span className="text-indigo-600">{data.name?.split(" ")[0] || "there"}</span>
            </h1>
          </div>
        )}
        {loading ? (
          <div className="w-12 h-12 rounded-2xl bg-slate-200/70 animate-pulse shrink-0" />
        ) : (
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0">
            {data.name?.charAt(0)?.toUpperCase() || "?"}
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
            <StatCard icon={<Calendar size={16} />} label="Total Visits" value={appointments.length} />
            <StatCard icon={<CalendarClock size={16} />} label="Upcoming" value={upcoming.length} />
            <StatCard icon={<Video size={16} />} label="Ready Now" value={readyNow.length} accent />
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 max-w-5xl">
        {/* Quick actions */}
        <div
          className="motion-safe:animate-[fadeInUp_0.5s_ease-out_both] lg:col-span-2 space-y-4"
          style={{ animationDelay: '150ms' }}
        >
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Quick Actions
          </p>
          <ActionButton
            title="Book an Appointment"
            description="Browse specialists and schedule a visit"
            icon={<Stethoscope size={20} className="text-indigo-600" />}
            onClick={() => navigate('/ViewDoctorss')}
          />
          <ActionButton
            title="My Appointments"
            description="View your upcoming and past sessions"
            icon={<LayoutList size={20} className="text-indigo-600" />}
            onClick={() => navigate('/userviewapp')}
            badge={!loading && upcoming.length > 0 ? upcoming.length : null}
          />
          <ActionButton
            title="Live Capture"
            description="Open your camera for real-time AI analysis"
            icon={<Video size={20} className="text-indigo-600" />}
            onClick={() => navigate('/LiveCapture')}
          />
        </div>

        {/* Sidebar widgets */}
        <div
          className="motion-safe:animate-[fadeInUp_0.5s_ease-out_both] space-y-6"
          style={{ animationDelay: '220ms' }}
        >
          {loading ? (
            <WidgetSkeleton />
          ) : (
            <NextAppointmentCard appointment={nextAppointment} onViewAll={() => navigate('/userviewapp')} />
          )}
          <HealthTipCard tip={tip} />
        </div>
      </div>

      <HealthBot />
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
    <div className="h-4 w-36 bg-slate-200/70 rounded animate-pulse mb-4" />
    <div className="space-y-2.5">
      <div className="h-9 bg-slate-50 rounded-xl animate-pulse" />
      <div className="h-9 bg-slate-50 rounded-xl animate-pulse" />
    </div>
  </div>
);

const NextAppointmentCard = ({ appointment, onViewAll }) => (
  <div className="bg-white border border-slate-100 rounded-3xl p-6">
    <div className="flex items-center justify-between mb-5">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Next Appointment</p>
      <button onClick={onViewAll} className="text-indigo-600 hover:text-indigo-700 transition-colors">
        <ExternalLink size={14} />
      </button>
    </div>

    {appointment ? (
      <>
        <p className="font-bold text-slate-800 text-sm break-all leading-tight mb-4">
          {appointment.doctormail}
        </p>
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl">
            <Calendar size={14} className="text-indigo-600 shrink-0" />
            <span className="text-xs font-bold text-slate-600">
              {new Date(appointment.date).toLocaleDateString(undefined, { dateStyle: "medium" })}
            </span>
          </div>
          <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl">
            <Clock size={14} className="text-indigo-600 shrink-0" />
            <span className="text-xs font-bold text-slate-600">{appointment.time}</span>
          </div>
        </div>
        <button
          onClick={onViewAll}
          className="w-full mt-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
        >
          View All Appointments <ArrowRight size={13} />
        </button>
      </>
    ) : (
      <div className="text-center py-4">
        <p className="text-sm text-slate-400">No upcoming appointments.</p>
        <button onClick={onViewAll} className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-700">
          Book one now
        </button>
      </div>
    )}
  </div>
);

const HealthTipCard = ({ tip }) => (
  <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6">
    <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
      <Lightbulb size={16} className="text-amber-500" />
    </div>
    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-2">Health Tip of the Day</p>
    <p className="text-sm text-slate-600 leading-relaxed">{tip}</p>
  </div>
);

const ActionButton = ({ title, description, icon, onClick, badge }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl hover:border-indigo-200 hover:shadow-md transition-all duration-300 group text-left"
  >
    <div className="flex items-center gap-5">
      <div className="p-3 bg-indigo-50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div>
        <p className="font-bold text-slate-800 tracking-tight">{title}</p>
        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
      </div>
    </div>
    <div className="flex items-center gap-3 shrink-0">
      {badge ? (
        <span className="min-w-[22px] h-[22px] px-1.5 flex items-center justify-center bg-indigo-600 text-white text-[11px] font-bold rounded-full">
          {badge}
        </span>
      ) : null}
      <ChevronRight
        size={18}
        className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all"
      />
    </div>
  </button>
);

export default Userdashboard;
