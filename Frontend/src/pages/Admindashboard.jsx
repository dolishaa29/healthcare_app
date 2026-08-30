import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Users, UserPlus, Stethoscope, AlertCircle, RefreshCw } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const STATS_CONFIG = [
  { key: "totalDoctors",    label: "Doctors",          icon: Stethoscope, bg: "bg-indigo-50",  text: "text-indigo-600"  },
  { key: "totalUsers",      label: "Patients",         icon: Users,       bg: "bg-violet-50",  text: "text-violet-600"  },
  { key: "pendingRequests", label: "Pending Requests", icon: UserPlus,    bg: "bg-amber-50",   text: "text-amber-600"   },
];

const StatCard = ({ label, value, icon: Icon, bg, text }) => (
  <div className="flex-1 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
      <Icon size={18} className={text} />
    </div>
    <p className={`text-4xl font-bold ${text} mb-1`}>
      {value ?? <span className="text-slate-200">—</span>}
    </p>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
  </div>
);

const StatSkeleton = () => (
  <div className="flex-1 bg-white border border-slate-100 rounded-2xl p-6">
    <div className="w-10 h-10 rounded-xl bg-slate-100 animate-pulse mb-4" />
    <div className="h-9 w-14 bg-slate-200/70 rounded animate-pulse mb-2" />
    <div className="h-2.5 w-24 bg-slate-100 rounded animate-pulse" />
  </div>
);

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-xl px-4 py-2.5 shadow-lg text-sm font-bold text-slate-700">
      {payload[0].payload.label}: <span className="text-indigo-600">{payload[0].value}</span>
    </div>
  );
};

const BAR_COLORS = { Pending: "#f59e0b", Approved: "#10b981", Rejected: "#f43f5e" };

const Admindashboard = () => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/admindashboard", {
        headers: { Authorization: `Bearer ${Cookies.get("emtoken")}` },
        withCredentials: true,
      });
      setData(res.data.dashboard);
    } catch {
      setError("Couldn't load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto md:overflow-hidden flex flex-col bg-slate-50 px-6 py-8 md:px-10 gap-5">

      {error && (
        <div className="motion-safe:animate-[fadeInUp_0.4s_ease-out_both] shrink-0 flex items-center justify-between gap-4 bg-red-50 border border-red-100 rounded-2xl px-5 py-4">
          <div className="flex items-center gap-3">
            <AlertCircle size={18} className="text-red-500 shrink-0" />
            <p className="text-sm font-semibold text-red-700">{error}</p>
          </div>
          <button
            onClick={fetchDashboard}
            className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-red-700 hover:text-red-800 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
          >
            <RefreshCw size={13} /> Retry
          </button>
        </div>
      )}

      {/* Stat row */}
      <div className="motion-safe:animate-[fadeInUp_0.4s_ease-out_both] shrink-0 flex flex-col sm:flex-row gap-5">
        {loading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          STATS_CONFIG.map(({ key, ...cfg }) => (
            <StatCard key={key} {...cfg} value={data?.[key]} />
          ))
        )}
      </div>

      {/* Chart — fills remaining height */}
      <div
        className="motion-safe:animate-[fadeInUp_0.4s_ease-out_both] flex-1 min-h-[340px] md:min-h-0 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col"
        style={{ animationDelay: '80ms' }}
      >
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Appointments</p>
        <p className="text-sm font-bold text-slate-700 mb-6">Breakdown by status</p>

        <div className="flex-1 min-h-0">
          {loading ? (
            <div className="w-full h-full bg-slate-50 rounded-xl animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.appointmentChart ?? []} barSize={56}>
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fontWeight: 700, fill: "#94a3b8" }}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  width={28}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f8fafc" }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {(data?.appointmentChart ?? []).map((entry) => (
                    <Cell key={entry.label} fill={BAR_COLORS[entry.label] ?? "#818cf8"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="flex gap-5 mt-4 justify-center">
          {Object.entries(BAR_COLORS).map(([label, color]) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[11px] font-bold text-slate-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Admindashboard;
