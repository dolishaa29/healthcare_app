import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { LayoutList, Loader2, ChevronRight, Stethoscope } from 'lucide-react';
import HealthBot from '../components/bot';

const Userdashboard = () => {
  const [data, setData] = useState({ email: "", name: "", contact: "", address: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + "/userdashboard", {
        headers: { "Authorization": `Bearer ${Cookies.get("token")}` },
        withCredentials: true,
      });
      if (response.status === 200) setData(response.data.dashboard);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="h-full w-full flex items-center justify-center bg-[#FDFBFF]">
      <Loader2 className="animate-spin text-indigo-600" size={35} />
    </div>
  );

  return (
    <div className="h-full overflow-y-auto bg-[#FDFBFF] px-6 py-10 md:px-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-[10px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-1">
            Patient Portal
          </p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            Welcome,{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
              {data.name?.split(" ")[0] || "there"}
            </span>
          </h1>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-lg border border-indigo-100">
          {data.name?.charAt(0) || "?"}
        </div>
      </div>

      <div className="max-w-2xl space-y-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-5">
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
        />
      </div>

      <HealthBot />
    </div>
  );
};

const ActionButton = ({ title, description, icon, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group text-left"
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
    <ChevronRight
      size={18}
      className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0"
    />
  </button>
);

export default Userdashboard;
