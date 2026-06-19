import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Users, UserPlus, Stethoscope, Loader2 } from "lucide-react";
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
    <p className={`text-4xl font-black ${text} mb-1`}>
      {value ?? <span className="text-slate-200">—</span>}
    </p>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
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

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/admindashboard", {
        headers: { Authorization: `Bearer ${Cookies.get("emtoken")}` },
        withCredentials: true,
      });
      setData(res.data.dashboard);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="h-full w-full flex items-center justify-center bg-[#FDFBFF]">
      <Loader2 className="animate-spin text-indigo-600" size={32} />
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-[#FDFBFF] px-6 py-8 md:px-10 gap-5">

      {/* Stat row */}
      <div className="flex gap-5">
        {STATS_CONFIG.map((cfg) => (
          <StatCard key={cfg.key} {...cfg} value={data?.[cfg.key]} />
        ))}
      </div>

      {/* Chart — fills remaining height */}
      <div className="flex-1 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col min-h-0">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Appointments</p>
        <p className="text-sm font-bold text-slate-700 mb-6">Breakdown by status</p>

        <div className="flex-1 min-h-0">
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
