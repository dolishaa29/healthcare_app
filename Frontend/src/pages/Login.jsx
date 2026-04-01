import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('user');

  const paths = {
    user: '/Userlogin',
    doctor: '/Doctorlogin',
    admin: '/Adminlogin'
  };

  const handleLogin = (e) => {
    e.preventDefault();
    navigate(paths[role]);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] bg-[radial-gradient(ellipse_at_top,_#f5f3ff,_#f8fafc)] font-sans overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-purple-200/40 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-200/40 blur-[100px] rounded-full" />

      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="public/health.jfif" 
          alt="Medical Background" 
          className="w-full h-full object-cover opacity-[0.04] grayscale" 
        />
      </div>

      <div className="relative z-10 w-full max-w-[420px] p-10 bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-[0_30px_60px_-15px_rgba(147,51,234,0.1)] mx-4">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Aura<span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Health</span>
          </h1>
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em] mt-2">Professional Care Portal</p>
        </div>

        <div className="flex bg-slate-100/50 p-1.5 rounded-2xl mb-8 border border-slate-200/60 shadow-inner">
          {['user', 'doctor', 'admin'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-3 text-xs font-bold uppercase rounded-xl transition-all duration-300 ${
                role === r 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-[1.03]' 
                : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2">Login Identity</label>
            <input 
              type="email" 
              placeholder="Email"
              required
              className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 transition-all shadow-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2">Secure Key</label>
            <input 
              type="password" 
              placeholder="Password"
              required
              className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 transition-all shadow-sm"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 mt-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-90 text-white font-bold rounded-2xl shadow-xl shadow-purple-200 transform transition-all active:scale-[0.98]"
          >
            Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;