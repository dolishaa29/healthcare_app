import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const Userregister = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !name || !contact || !address) {
      setMessage("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(import.meta.env.VITE_API_URL + "/userregister", {
        email, password, name, contact, address,
      });

      if (response.data.success) {
        setMessage("OTP sent to your email. Please verify.");
        setStep(2);
      } else {
        setMessage(response.data.msg || "Registration Failed");
      }
    } catch (err) {
      setMessage(err.response?.data?.msg || "Error while registering");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    if (!otp) {
      setMessage("Please enter the OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(import.meta.env.VITE_API_URL + "/userregisterverify", {
        email, otp,
      });

      if (response.data.success) {
        setMessage("Registration Successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage(response.data.msg || "OTP verification failed");
      }
    } catch (err) {
      setMessage(err.response?.data?.msg || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fafaf9] bg-[radial-gradient(ellipse_at_top,_#f4f6ec,_#fafaf9)] font-sans overflow-hidden py-10">

      <div className="motion-safe:animate-[floatSlow_9s_ease-in-out_infinite] absolute top-[-10%] left-[-5%] w-96 h-96 bg-violet-200/40 blur-[100px] rounded-full" />
      <div className="motion-safe:animate-[floatSlower_11s_ease-in-out_infinite] absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-indigo-200/40 blur-[100px] rounded-full" />

      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="public/health.jfif"
          alt="Medical Background"
          className="w-full h-full object-cover opacity-[0.04] grayscale"
        />
      </div>

      <div className="motion-safe:animate-[fadeInUp_0.6s_ease-out_both] relative z-10 w-full max-w-[500px] p-10 bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-[0_30px_60px_-15px_rgba(147,51,234,0.1)] mx-4">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tighter text-slate-900">
            Aura<span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Health</span>
          </h1>
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em] mt-2">
            {step === 1 ? "Create Patient Account" : "Verify Your Email"}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-400 transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-400 transition-all shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1">Secure Password</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-400 transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1">Contact Number</label>
              <PhoneInput
                placeholder="Your Mobile Number"
                value={contact}
                onChange={setContact}
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-400 transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1">Home Address</label>
              <input
                type="text"
                placeholder="Street, City, Zip"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-400 transition-all shadow-sm"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-4 mt-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 text-white font-bold rounded-2xl shadow-xl shadow-violet-200 transform transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? "Sending OTP..." : "Send Verification OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpVerify} className="space-y-4">
            <p className="text-center text-sm text-slate-500">
              A 6-digit OTP has been sent to <span className="font-semibold text-violet-600">{email}</span>
            </p>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1">Enter OTP</label>
              <input
                type="text"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-center text-xl tracking-[0.5em] placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-400 transition-all shadow-sm"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-4 mt-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 text-white font-bold rounded-2xl shadow-xl shadow-violet-200 transform transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? "Verifying..." : "Verify & Register"}
            </button>

            <button
              type="button"
              onClick={() => { setStep(1); setMessage(""); setOtp(""); }}
              className="w-full py-2 text-sm text-slate-500 hover:text-violet-600 transition-colors"
            >
              Back to form
            </button>
          </form>
        )}

        {message && (
          <p className={`text-center text-xs mt-4 font-bold ${message.includes('Successful') || message.includes('sent') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?
          <button onClick={() => navigate('/login')} className="text-violet-600 hover:underline ml-1 font-semibold">Sign In</button>
        </p>
      </div>
    </div>
  );
};

export default Userregister;
