import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {
  CalendarPlus, LayoutList, LogOut, Menu, X,
  LayoutDashboard, User, MessageCircle, FileText, Video, CalendarClock
} from 'lucide-react';

const UserLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const closeMobile = () => setMobileOpen(false);
  const go = (path) => {
    navigate(path);
    closeMobile();
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-900 overflow-hidden">

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 z-30">
        <span className="font-bold text-lg tracking-tight text-slate-900">
          Aura<span className="text-indigo-600">Health</span>
        </span>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/40 z-40"
          onClick={closeMobile}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64
        ${isSidebarOpen ? 'lg:w-64' : 'lg:w-20'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        bg-white border-r border-slate-100 transition-all duration-300 lg:duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col shrink-0`}
      >
        <div className="h-24 flex items-center justify-between px-7">
          {(isSidebarOpen || mobileOpen) && (
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Aura<span className="text-indigo-600">Health</span>
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="hidden lg:flex p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 transition-all active:scale-90"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <button
            onClick={closeMobile}
            className="lg:hidden p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 transition-all active:scale-90"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
          <SidebarLink icon={<LayoutDashboard size={20} />} label="Dashboard" active={location.pathname === '/Userdashboard'} onClick={() => go('/Userdashboard')} isExpanded={isSidebarOpen || mobileOpen} />
          <SidebarLink icon={<LayoutList size={20} />} label="My Appointments" active={location.pathname === '/userviewapp'} onClick={() => go('/userviewapp')} isExpanded={isSidebarOpen || mobileOpen} />
          <SidebarLink icon={<CalendarPlus size={20} />} label="View Doctors" active={location.pathname === '/ViewDoctorss'} onClick={() => go('/ViewDoctorss')} isExpanded={isSidebarOpen || mobileOpen} />
          <SidebarLink icon={<User size={20} />} label="Profile" active={location.pathname === '/userprofile'} onClick={() => go('/userprofile')} isExpanded={isSidebarOpen || mobileOpen} />
          <SidebarLink icon={<MessageCircle size={20} />} label="Messages" active={location.pathname === '/userchat'} onClick={() => go('/userchat')} isExpanded={isSidebarOpen || mobileOpen} />
          <SidebarLink icon={<FileText size={20} />} label="Report Analysis" active={location.pathname === '/ReportAnalysis'} onClick={() => go('/ReportAnalysis')} isExpanded={isSidebarOpen || mobileOpen} />
          <SidebarLink icon={<Video size={20} />} label="Live Capture" active={location.pathname === '/LiveCapture'} onClick={() => go('/LiveCapture')} isExpanded={isSidebarOpen || mobileOpen} />
          <SidebarLink icon={<CalendarClock size={20} />} label="Book by Slot" active={location.pathname === '/SlotBooking'} onClick={() => go('/SlotBooking')} isExpanded={isSidebarOpen || mobileOpen} />
        </nav>

        <div className="p-5 border-t border-slate-50">
          <button
            onClick={() => { Cookies.remove("token"); navigate("/login"); }}
            className="w-full flex items-center gap-4 px-4 py-4 text-red-500 hover:bg-red-50/50 rounded-2xl transition-all duration-300 font-bold text-[13px]"
          >
            <LogOut size={18} />
            {(isSidebarOpen || mobileOpen) && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-hidden pt-16 lg:pt-0">
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

export default UserLayout;
