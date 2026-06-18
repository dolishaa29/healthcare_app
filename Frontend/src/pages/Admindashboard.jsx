import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import {
  Users, UserPlus, Calendar, Stethoscope, ChevronRight, Loader2
} from 'lucide-react';

const Admindashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", contact: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchadminDashboard(); }, []);

  const fetchadminDashboard = async () => {
    setLoading(true);
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + "/admindashboard", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("emtoken")}`,
        },
        withCredentials: true,
      });
      setData(response.data.dashboard);
    } catch (error) {
      console.error("Error fetching admin dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { name: 'View Doctors',     path: '/Viewdoctor',       icon: <Stethoscope size={20} className="text-indigo-600" />, desc: 'Manage registered doctors' },
    { name: 'View Users',       path: '/Viewusers',        icon: <Users size={20} className="text-indigo-600" />,       desc: 'Browse all patient accounts' },
    { name: 'Doctor Requests',  path: '/Doctorrequest',    icon: <UserPlus size={20} className="text-indigo-600" />,    desc: 'Approve or reject applications' },
    { name: 'View Appointments',path: '/ViewAppointment',  icon: <Calendar size={20} className="text-indigo-600" />,    desc: 'Schedule and manage bookings' },
  ];

  if (loading) return (
    <div className="h-full w-full flex items-center justify-center bg-[#FDFBFF]">
      <Loader2 className="animate-spin text-indigo-600" size={35} />
    </div>
  );

  return (
    <div className="h-full overflow-y-auto bg-[#FDFBFF] px-6 py-10 md:px-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-[10px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-1">Admin Portal</p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            Admin{" "}
            <span className="bg-linear-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">{data.email}</p>
        </div>
        <div className="w-12 h-12 bg-linear-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-lg border border-indigo-100">
          A
        </div>
      </div>

      <div className="max-w-2xl space-y-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-5">Quick Actions</p>
        {menuItems.map((item) => (
          <ActionButton key={item.path} title={item.name} description={item.desc} icon={item.icon} onClick={() => navigate(item.path)} />
        ))}
      </div>
    </div>
  );
};

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

export default Admindashboard;
