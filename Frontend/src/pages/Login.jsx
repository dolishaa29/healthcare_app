import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin =async (e) => {
  e.preventDefault();
  setLoading(true);

    if (!email || !password) {
      setMessage("Please fill all fields");
      return;
    }
    if(role==="user"){
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/userlogin",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200 && response.data.token) {
        Cookies.set("token", response.data.token, { expires: 1 });

        setMessage("Login Successful");
        navigate("/Userdashboard");
      } else {
        setMessage(response.data.msg || "Invalid Credentials");
      }

    } catch (err) {
      console.error("Login Error:", err.response ? err.response.data : err.message);
      setMessage(err.response?.data?.msg || "Login Failed! Please try again.");
    } finally {
      setLoading(false);
    }
    }

    else if(role==="doctor"){

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/doctorlogin",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200 && response.data.token) {
        Cookies.set("emstoken", response.data.token, { expires: 1 });

        setMessage("Login Successful");
        navigate("/Doctordashboard");
      } else {
        setMessage(response.data.msg || "Invalid Credentials");
      }

    } catch (err) {
      console.error("Login Error:", err.response ? err.response.data : err.message);
      setMessage(err.response?.data?.msg || "Login Failed! Please try again.");
    } finally {
      setLoading(false);
    }


  }

  else if(role==="admin"){
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/adminlogin",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200 && response.data.token) {
      
        Cookies.set("emtoken", response.data.token, { expires: 1 });

        setMessage("Login Successful");
        navigate("/Admindashboard");
      } else {
        setMessage(response.data.msg || "Invalid login credentials");
      }

    } catch (err) {
      console.error("Login Error:", err.response ? err.response.data : err.message);
      setMessage(err.response?.data?.msg || "Login failed! Please try again.");
    } finally {
      setLoading(false);
    }
  }

}

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fafaf9] bg-[radial-gradient(ellipse_at_top,_#f4f6ec,_#fafaf9)] font-sans overflow-hidden">

      <div className="motion-safe:animate-[floatSlow_9s_ease-in-out_infinite] absolute top-[-10%] left-[-5%] w-96 h-96 bg-violet-200/40 blur-[100px] rounded-full" />
      <div className="motion-safe:animate-[floatSlower_11s_ease-in-out_infinite] absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-indigo-200/40 blur-[100px] rounded-full" />



      <div className="motion-safe:animate-[fadeInUp_0.6s_ease-out_both] relative z-10 w-full max-w-[420px] p-10 bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-[0_30px_60px_-15px_rgba(147,51,234,0.1)] mx-4">

        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-tighter text-slate-900">
            Aura<span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Health</span>
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
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg scale-[1.03]' 
                : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2">Login </label>
            <input 
              type="email" 
              placeholder="Email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
              className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-400 transition-all shadow-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2">Secure </label>
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-400 transition-all shadow-sm"
            />
          </div>
          {role === "user" && (
            <div className="text-right mb-0">
              <button 
                type="button"
                onClick={() => navigate('/forgotpassword/user')}
                className="text-sm text-violet-600 hover:underline font-semibold"
              >
                Forgot Password?
              </button>
            </div>
          )
          }
            {role === "doctor" && (
            <div className="text-right mb-0">
              <button 
                type="button"
                onClick={() => navigate('/forgotpassword/doctor')}
                className="text-sm text-violet-600 hover:underline font-semibold"
              >
                Forgot Password?
              </button>
            </div>
          )
          }
           
          <button 
            type="submit"
            className="w-full py-4 mt-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-white font-bold rounded-2xl shadow-xl shadow-violet-200 transform transition-all active:scale-[0.98]"
          >
            Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        </form>
        
         {role === "user" && (
          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account? 
            <button onClick={() => navigate('/Userregister')} className="text-violet-600 hover:underline ml-1 font-semibold">Register</button>
          </p>
        )}

        {role === "doctor" && (
          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?  
            <button onClick={() => navigate('/Doctorregister')} className="text-violet-600 hover:underline ml-1 font-semibold">Register</button>
          </p>
        )}

        {message && (
          <p className={`text-center text-xs mt-4 font-bold text-red-600`}>
            {message}
          </p>
        )}

      </div>
    </div>
  );
};

export default Login;