import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { 
  Users, UserCheck, UserPlus, UserX, 
  Calendar, Stethoscope, LayoutDashboard, 
  LogOut, Menu, X, ChevronRight, Loader2
} from 'lucide-react';

const Admindashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", contact: "" });
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchadminDashboard();
  }, []);

  const fetchadminDashboard = async () => {
    setLoading(true);
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + "/admindashboard", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get("emtoken")}`,
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

  const handleLogout = () => {
    Cookies.remove("emtoken");
    navigate("/");
  };

  const menuItems = [
    { name: 'View Doctor', path: '/Viewdoctor', icon: <Stethoscope size={20} /> },
    { name: 'View Users', path: '/Viewusers', icon: <Users size={20} /> },
    { name: 'Doctor Requests', path: '/Doctorrequest', icon: <UserPlus size={20} /> },
    { name: 'View Appointment', path: '/ViewAppointment', icon: <Calendar size={20} /> },
  ];

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
              AuraAdmin
            </span>
          )}
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)} 
            className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 transition-all active:scale-90"
          >
            {isSidebarOpen ? <X size={18}/> : <Menu size={18}/>}
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto no-scrollbar">
          <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active isExpanded={isSidebarOpen} />
          {menuItems.map((item) => (
            <SidebarLink 
              key={item.path}
              icon={item.icon} 
              label={item.name} 
              onClick={() => navigate(item.path)} 
              isExpanded={isSidebarOpen} 
            />
          ))}
        </nav>

        <div className="p-5 border-t border-slate-50">
          <button 
            onClick={handleLogout}
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
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Admin Dashboard</h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-10 pb-10">
          <div className="max-w-6xl space-y-6">
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {menuItems.map((item) => (
                <ActionButton 
                  key={item.name}
                  title={item.name} 
                  icon={item.icon} 
                  onClick={() => navigate(item.path)}
                />
              ))}
            </section>

          </div>
        </div>
      </main>
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
    className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[2rem] hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 group text-left"
  >
    <div className="flex items-center gap-5">
      <div className="p-3 bg-indigo-50 rounded-xl group-hover:scale-110 transition-transform duration-500 text-indigo-600">
        {icon}
      </div>
      <span className="font-bold text-slate-700 tracking-tight text-sm">{title}</span>
    </div>
    <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
  </button>
);

export default Admindashboard;