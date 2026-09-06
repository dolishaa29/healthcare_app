import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Viewuserall = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/userbyid/${id}`);
      const data = response.data.user;

      setUser(data);

      if (data?.image) {
        const filename = data.image.split(/[\\/]/).pop();
        setImagePreview(`${API_BASE_URL}/images/${filename}`);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setError(err.response?.data?.message || "Failed to load user profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const infoLabelStyle = "block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1";
  const infoValueStyle = "text-slate-800 font-medium bg-white/50 border border-slate-100 px-4 py-2.5 rounded-xl shadow-sm backdrop-blur-sm";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf9]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#fafaf9] bg-[radial-gradient(ellipse_at_top,_#f4f6ec,_#fafaf9)] font-sans py-12 px-4 relative overflow-x-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100/40 blur-[100px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100/40 blur-[100px] rounded-full -z-10" />

      <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-2xl rounded-[2.5rem] border border-white shadow-[0_30px_60px_-15px_rgba(86,107,46,0.08)] p-6 md:p-12">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl border-4 border-white overflow-hidden shadow-2xl bg-gradient-to-tr from-violet-500 to-indigo-600 flex-shrink-0">
              {imagePreview ? (
                <img src={imagePreview} className="w-full h-full object-cover" alt="User" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-3xl">
                  {user?.name?.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {user?.name}
              </h1>
              <span className="inline-flex items-center px-3 py-1 mt-2 rounded-full bg-indigo-50 text-indigo-600 text-[11px] font-bold uppercase tracking-wider border border-indigo-100">
                {user?.nationality || 'Member'}
              </span>
            </div>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-indigo-600 bg-white border border-slate-200 rounded-full hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm"
          >
            ← Back
          </button>
        </div>

        {error ? (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-center font-bold">
            {error}
          </div>
        ) : (
          <div className="space-y-10">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="space-y-5">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(86,107,46,0.5)]"></span>
                  Personal Details
                </h3>
                <div className="space-y-4">
                  <div><label className={infoLabelStyle}>Email Address</label><div className={infoValueStyle}>{user?.email}</div></div>
                  <div><label className={infoLabelStyle}>Contact Number</label><div className={infoValueStyle}>{user?.contact}</div></div>
                  <div className="flex gap-4">
                    <div className="flex-1"><label className={infoLabelStyle}>Gender</label><div className={infoValueStyle}>{user?.gender}</div></div>
                    <div className="flex-1"><label className={infoLabelStyle}>Blood Group</label><div className={infoValueStyle}>{user?.bloodGroup || 'N/A'}</div></div>
                  </div>
                  <div><label className={infoLabelStyle}>Date of Birth</label><div className={infoValueStyle}>{user?.dob}</div></div>
                </div>
              </section>

              <section className="space-y-5">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]"></span>
                  Family Information
                </h3>
                <div className="space-y-4">
                  <div><label className={infoLabelStyle}>Father's Name</label><div className={infoValueStyle}>{user?.fatherName}</div></div>
                  <div><label className={infoLabelStyle}>Mother's Name</label><div className={infoValueStyle}>{user?.motherName}</div></div>
                  <div><label className={infoLabelStyle}>Marital Status</label><div className={infoValueStyle}>{user?.martitalStatus}</div></div>
                </div>
              </section>
            </div>



            <section className="p-6 bg-gradient-to-br from-red-50/50 to-white border border-red-100 rounded-3xl">
                <h3 className="text-sm font-bold text-slate-600 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-slate-500 rounded-full"></span>
                  Emergency Contact Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><label className={infoLabelStyle}>Contact Name</label><div className={infoValueStyle}>{user?.emergencyContactName}</div></div>
                    <div><label className={infoLabelStyle}>Relationship</label><div className={infoValueStyle}>{user?.emergencyRelation}</div></div>
                    <div><label className={infoLabelStyle}>Phone Number</label><div className={infoValueStyle}>{user?.emergencyContactNumber}</div></div>
                </div>
            </section>



            <section className="pt-6 border-t border-slate-100">
                <label className={infoLabelStyle}>Permanent Address</label>
                <div className="text-slate-600 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-sm font-medium leading-relaxed">
                  {user?.address || "No address provided."}
                </div>
            </section>

          </div>
        )}
      </div>
    </div>
  );
};

export default Viewuserall;