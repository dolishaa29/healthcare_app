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
  const [certificate, setCertificate] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !name || !specialization || !contact || !address || !certificate) {
      setMessage("Please fill all fields and upload your certificate.");
      return;
    }

    setLoading(true);
    setMessage("");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("specialization", specialization);
    formData.append("contact", contact);
    formData.append("address", address);
    formData.append("certificate", certificate); 

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/doctorpermission",
        formData
      );

      if (response.status === 201 || response.status === 200) {
        setMessage("success: Registration successful! Waiting for admin approval.");
        setCertificate(null);
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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FDFBFF] bg-[radial-gradient(ellipse_at_top,#f5f3ff,#FDFBFF)] font-sans overflow-hidden py-10">
      <div className="motion-safe:animate-[floatSlow_9s_ease-in-out_infinite] absolute top-[-10%] left-[-5%] w-96 h-96 bg-purple-200/40 blur-[100px] rounded-full" />
      <div className="motion-safe:animate-[floatSlower_11s_ease-in-out_infinite] absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-200/40 blur-[100px] rounded-full" />

      <div className="motion-safe:animate-[fadeInUp_0.6s_ease-out_both] relative z-10 w-full max-w-125 p-10 bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-[0_30px_60px_-15px_rgba(147,51,234,0.1)] mx-4">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tighter text-slate-900">
            Aura<span className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Health</span>
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
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus-within:ring-4 focus-within:ring-purple-500/10 transition-all shadow-sm"
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

          <div className="bg-slate-50 p-4 rounded-xl border-2 border-dashed border-slate-200">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Medical Docs (PDF Only)</label>
            <input 
              type="file" 
              accept=".pdf" 
              onChange={(e) => setCertificate(e.target.files[0])} 
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
              required 
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full py-4 mt-4 bg-linear-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-95 text-white font-bold rounded-2xl shadow-xl shadow-purple-200 transform transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? "Uploading Documents..." : "Submit Registration Request"}
          </button>
        </form>

        {message && (
          <p className={`text-center text-xs mt-4 font-bold ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
            {message.replace('success: ', '')}
          </p>
        )}

        <p className="text-center text-sm text-slate-500 mt-6">
          Already applied? 
          <button onClick={() => navigate('/login')} className="text-purple-600 hover:underline ml-1 font-semibold">Back to Login</button>
        </p>
      </div>
    </div>
  );
};

export default Doctorregister;