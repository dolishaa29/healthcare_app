import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import {
  CalendarPlus, LayoutList, LogOut, Loader2,
  Menu, X, LayoutDashboard, ChevronRight, User, MessageCircle, FileText
} from 'lucide-react';
import HealthBot from '../components/bot';

const Userdashboard = () => {
  const [data, setData] = useState({ email: "", name: "", contact: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
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
    <div className="h-screen w-full flex items-center justify-center bg-[#fcfcfd]">
      <Loader2 className="animate-spin text-indigo-600" size={35} />
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-900 overflow-hidden">
      
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-100 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col z-50`}>
        <div className="h-24 flex items-center justify-between px-7">
          {isSidebarOpen && (
            <span className="font-black text-xl tracking-tighter bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              AuraHealth
            </span>
          )}
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)} 
            className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 transition-all active:scale-90"
          >
            {isSidebarOpen ? <X size={18}/> : <Menu size={18}/>}
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1.5">
          <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active isExpanded={isSidebarOpen} />
          <SidebarLink icon={<CalendarPlus size={20}/>} label="Book Appointment" onClick={() => navigate('/Appointment')} isExpanded={isSidebarOpen} />
          <SidebarLink icon={<LayoutList size={20}/>} label="My Appointments" onClick={() => navigate('/userviewapp')} isExpanded={isSidebarOpen} />
          <SidebarLink icon={<CalendarPlus size={20}/>} label="View Doctor/Appointments" onClick={() => navigate('/ViewDoctorss')} isExpanded={isSidebarOpen} />
          <SidebarLink icon={<User size={20}/>} label="Profile" onClick={() => navigate('/userprofile')} isExpanded={isSidebarOpen} />
          <SidebarLink icon={<MessageCircle size={20}/>} label="Messages" onClick={() => navigate('/userchat')} isExpanded={isSidebarOpen} />
          <SidebarLink icon={<FileText size={20}/>} label="Report Analysis" onClick={()=>navigate('/ReportAnalysis')} isExpanded={isSidebarOpen}/>
        </nav>

        <div className="p-5 border-t border-slate-50">
          <button 
            onClick={() => { Cookies.remove("token"); navigate("/"); }}
            className="w-full flex items-center gap-4 px-4 py-4 text-red-500 hover:bg-red-50/50 rounded-2xl transition-all duration-300 font-bold text-[13px]"
          >
            <LogOut size={18} />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        
        <header className="h-24 px-10 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Welcome, {data.name.split(' ')[0]}</h1>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mt-1">Patient Portal</p>
          </div>
          <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 font-bold border border-slate-200/50">
            {data.name?.charAt(0)}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-10 pb-10">
          <div className="max-w-4xl space-y-10">
            
            <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ActionButton 
                title="Book New Appointment" 
                icon={<CalendarPlus className="text-indigo-600"/>} 
                onClick={() => navigate('/Appointment')}
              />
              <ActionButton
                title="View My History"
                icon={<LayoutList className="text-indigo-600"/>}
                onClick={() => navigate('/userviewapp')}
              />
            </section>
            </div>
        </div>
      </main>

      <HealthBot />
    </div>
  );
};


const SidebarLink = ({ icon, label, active = false, onClick, isExpanded }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold text-[13px]
    ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50 hover:text-indigo-600'}`}
  >
    <span className="shrink-0">{icon}</span>
    {isExpanded && <span className="truncate tracking-tight">{label}</span>}
  </button>
);

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