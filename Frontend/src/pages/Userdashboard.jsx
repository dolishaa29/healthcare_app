import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { CalendarPlus, LayoutList, Loader2, ChevronRight } from 'lucide-react';


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
    <div className="h-full w-full flex items-center justify-center bg-[#fcfcfd]">
      <Loader2 className="animate-spin text-indigo-600" size={35} />
    </div>
  );

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <header className="h-24 px-10 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Welcome, {data.name.split(' ')[0]}</h1>
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mt-1">Patient Portal</p>
        </div>
        <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 font-bold border border-slate-200/50">
          {data.name?.charAt(0)}
        </div>
      </header>

      <div className="flex-1 px-10 pb-10">
        <div className="max-w-4xl space-y-10">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ActionButton
              title="Book New Appointment"
              icon={<CalendarPlus className="text-indigo-600" />}
              onClick={() => navigate('/Appointment')}
            />
            <ActionButton
              title="View My History"
              icon={<LayoutList className="text-indigo-600" />}
              onClick={() => navigate('/userviewapp')}
            />
          </section>
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ title, icon, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-between p-7 bg-white border border-slate-100 rounded-[2rem] hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 group text-left">
    <div className="flex items-center gap-5">
      <div className="p-3 bg-indigo-50 rounded-xl group-hover:scale-110 transition-transform duration-500">{icon}</div>
      <span className="font-bold text-slate-700 tracking-tight">{title}</span>
    </div>
    <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
  </button>
);

export default Userdashboard;
