import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useParams, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const { role } = useParams();
    const navigate = useNavigate();
    
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1); 
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ msg: "", isError: false });

    const isUser = role === "user";
    const apiPath = isUser ? "/user" : "/doctor";
    const token = Cookies.get(isUser ? "token" : "emstoken");

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ msg: "", isError: false });

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}${apiPath}forgotpassword`, 
                { email, role }, 
                { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
            );
            setStatus({ msg: response.data.message || "OTP sent successfully!", isError: false });
            setStep(2);
        } catch (err) {
            setStatus({ msg: err.response?.data?.message || "Failed to send OTP", isError: true });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ msg: "", isError: false });

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}${apiPath}verifyotp`,
                { email, otp, role },
                { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
            );
            setStatus({ msg: response.data.message || "OTP Verified!", isError: false });
        } catch (err) {
            setStatus({ msg: err.response?.data?.message || "Invalid OTP", isError: true });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] bg-[radial-gradient(ellipse_at_top,_#f5f3ff,_#f8fafc)] font-sans overflow-hidden">
            
            <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-purple-200/40 blur-[100px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-200/40 blur-[100px] rounded-full" />
            <div className="absolute inset-0 z-0 pointer-events-none">
                <img 
                    src="/health.jfif" 
                    alt="Medical Background" 
                    className="w-full h-full object-cover opacity-[0.04] grayscale" 
                />
            </div>

            <div className="relative z-10 w-full max-w-[420px] p-10 bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-[0_30px_60px_-15px_rgba(147,51,234,0.1)] mx-4">
                
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        Aura<span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Health</span>
                    </h1>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em] mt-2">
                        {step === 1 ? "Reset Access" : "Verify Identity"}
                    </p>
                </div>

                {status.msg && (
                    <div className={`mb-6 p-4 rounded-2xl text-xs font-bold text-center ${
                        status.isError ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-50 text-green-600 border border-green-100"
                    }`}>
                        {status.msg}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2">Verification Email</label>
                            <input 
                                type="email" 
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 transition-all shadow-sm"
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 mt-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-90 text-white font-bold rounded-2xl shadow-xl shadow-purple-200 transform transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? "Requesting..." : "Send OTP"}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOtp} className="space-y-6 text-center">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 text-left">Security Code</label>
                            <input 
                                type="text" 
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                maxLength="6"
                                className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 text-center text-xl font-bold tracking-[0.5em] focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-400 transition-all shadow-sm"
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-green-600 to-teal-600 hover:opacity-90 text-white font-bold rounded-2xl shadow-xl transform transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? "Checking..." : "Verify & Continue"}
                        </button>
                        
                        <button 
                            type="button" 
                            onClick={() => { setStep(1); setStatus({msg:"", isError:false}); }}
                            className="text-sm text-purple-600 hover:underline font-semibold transition-all mt-4"
                        >
                            Wait, I entered wrong email
                        </button>
                    </form>
                )}

                <div className="mt-10 pt-6 border-t border-slate-100 text-center">
                    <button 
                        onClick={() => navigate('/')} 
                        className="text-sm text-slate-500 hover:text-purple-600 font-semibold flex items-center justify-center gap-2 mx-auto transition-colors"
                    >
                        <span>←</span> Back to Login
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ForgotPassword;