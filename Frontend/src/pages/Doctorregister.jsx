import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const Doctorregister = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !name || !specialization || !contact || !address) {
      setMessage("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(import.meta.env.VITE_API_URL + "/doctorpermission", {
        email, name, specialization, contact, address,
      });

      if (response.status === 201) {
        setMessage("Registration successful! Waiting for admin approval.");
      } else {
        setMessage(response.data.message || "Registration Failed");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Error while registering");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] bg-[radial-gradient(ellipse_at_top,_#f5f3ff,_#f8fafc)] font-sans overflow-hidden py-10">
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-purple-200/40 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-200/40 blur-[100px] rounded-full" />
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="public/health.jfif" 
          alt="Medical Background" 
          className="w-full h-full object-cover opacity-[0.04] grayscale" 
        />
      </div>

      <div className="relative z-10 w-full max-w-[500px] p-10 bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-[0_30px_60px_-15px_rgba(147,51,234,0.1)] mx-4">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Aura<span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Health</span>
          </h1>
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em] mt-2">Doctor Registration</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1">Full Name</label>
              <input 
                type="text" 
                placeholder="Dr. John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)} 
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1">Email</label>
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 transition-all shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1">Specialization</label>
            <input 
              type="text" 
              placeholder="e.g. Cardiology, Neurology" 
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)} 
              required
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 transition-all shadow-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1">Contact Number</label>
            <PhoneInput
              placeholder="Enter phone number"
              value={contact}
              onChange={setContact}
              required
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 transition-all shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1">Clinic/Hospital Address</label>
            <input 
              type="text" 
              placeholder="Complete Address" 
              value={address}
              onChange={(e) => setAddress(e.target.value)} 
              required
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 transition-all shadow-sm"
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full py-4 mt-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-95 text-white font-bold rounded-2xl shadow-xl shadow-purple-200 transform transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? "Processing..." : "Submit Registration Request"}
          </button>
        </form>

        {message && (
          <p className={`text-center text-xs mt-4 font-bold ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}

        <p className="text-center text-sm text-slate-500 mt-6">
          Already applied? 
          <button onClick={() => navigate('/')} className="text-purple-600 hover:underline ml-1 font-semibold">Back to Login</button>
        </p>
      </div>
    </div>
  );
};

export default Doctorregister;
