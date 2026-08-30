import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Changepassworddoc = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setError("New password and confirm password do not match");
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/changepassword`,
        {
          oldpassword: currentPassword,
          newpassword: newPassword,
        },
        {
          headers: { "Authorization": `Bearer ${Cookies.get("emstoken")}` },
          withCredentials: true
        }
      );
      if (response.status === 200) {
        setSuccess("Password updated successfully!");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 font-sans flex items-center justify-center py-10 px-4">
      <div className="motion-safe:animate-[fadeInUp_0.4s_ease-out_both] w-full max-w-md p-10 bg-white border border-slate-100 rounded-3xl shadow-sm">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Aura<span className="text-indigo-600">Health</span>
          </h1>
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em] mt-2">Security Settings</p>
          <h2 className="text-xl font-semibold text-slate-700 mt-4">Update Password</h2>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all shadow-sm"
            />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all shadow-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              className={`w-full px-4 py-3 bg-white border rounded-xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 transition-all shadow-sm ${
                newPassword && confirmNewPassword && newPassword !== confirmNewPassword 
                ? 'border-red-300 focus:ring-red-500/10 focus:border-red-400' 
                : 'border-slate-200 focus:ring-indigo-500/10 focus:border-indigo-400'
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !newPassword || newPassword !== confirmNewPassword}
            className="w-full py-4 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-sm transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Update Password"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-center text-xs font-bold text-red-500">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-lg">
            <p className="text-center text-xs font-bold text-green-600">{success}</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate(-1)} 
            className="text-slate-400 hover:text-indigo-600 text-sm font-medium transition-colors"
          >
            ← Back to Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Changepassworddoc;