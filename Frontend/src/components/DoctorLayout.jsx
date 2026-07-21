import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {
  LayoutDashboard, CalendarCheck, LogOut, Menu, X,
  User, MessageCircle
} from 'lucide-react';

const DoctorLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#FDFBFF] font-sans text-slate-900 overflow-hidden">

      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-100 transition-all duration-500 ease-in-out flex flex-col z-50 shrink-0`}>
        <div className="h-24 flex items-center justify-between px-7">
          {isSidebarOpen && (
            <span className="font-black text-xl tracking-tighter bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              DoctorPortal
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 transition-all active:scale-90"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1.5">
          <SidebarLink icon={<LayoutDashboard size={20} />} label="Dashboard" active={location.pathname === '/Doctordashboard'} onClick={() => navigate('/Doctordashboard')} isExpanded={isSidebarOpen} />
          <SidebarLink icon={<CalendarCheck size={20} />} label="Appointments" active={location.pathname === '/doctorviewapp'} onClick={() => navigate('/doctorviewapp')} isExpanded={isSidebarOpen} />
          <SidebarLink icon={<User size={20} />} label="Profile" active={location.pathname === '/doctorprofile'} onClick={() => navigate('/doctorprofile')} isExpanded={isSidebarOpen} />
          <SidebarLink icon={<MessageCircle size={20} />} label="Messages" active={location.pathname === '/doctorchat'} onClick={() => navigate('/doctorchat')} isExpanded={isSidebarOpen} />
        </nav>

        <div className="p-5 border-t border-slate-50">
          <button
            onClick={() => { Cookies.remove("emstoken"); navigate("/login"); }}
            className="w-full flex items-center gap-4 px-4 py-4 text-red-500 hover:bg-red-50/50 rounded-2xl transition-all duration-300 font-bold text-[13px]"
          >
            <LogOut size={18} />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-hidden">
        <Outlet />
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

export default DoctorLayout;
