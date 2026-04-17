import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ProfileDocterForAll = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [doctor, setDoctor] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const fetchDoctorProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/doctorprofileview/${id}`);
      const data = response.data.doctor;
      
      setDoctor(data);

      if (data?.image) {
        const filename = data.image.split(/[\\/]/).pop();
        setImagePreview(`${API_BASE_URL}/images/${filename}`);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.response?.data?.message || "Failed to load doctor profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
     fetchDoctorProfile();
  }, [id]);

  const infoLabelStyle = "block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1";
  const infoValueStyle = "text-slate-800 font-medium bg-white/50 border border-slate-100 px-4 py-2.5 rounded-xl shadow-sm backdrop-blur-sm";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] bg-[radial-gradient(ellipse_at_top,_#f5f3ff,_#f8fafc)] font-sans py-12 px-4 relative overflow-x-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100/40 blur-[100px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/40 blur-[100px] rounded-full -z-10" />

      <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-2xl rounded-[2.5rem] border border-white shadow-[0_30px_60px_-15px_rgba(147,51,234,0.08)] p-6 md:p-12">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl border-4 border-white overflow-hidden shadow-2xl bg-gradient-to-tr from-purple-500 to-blue-500 flex-shrink-0">
              {imagePreview ? (
                <img src={imagePreview} className="w-full h-full object-cover" alt="Doctor" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-3xl">
                  {doctor?.name?.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Dr. {doctor?.name}
              </h1>
              <span className="inline-flex items-center px-3 py-1 mt-2 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold uppercase tracking-wider border border-blue-100">
                {doctor?.specialization}
              </span>
            </div>
          </div>
          <button 
           onClick={() => navigate(`/rating/${id}`)}            
         className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-purple-600 bg-white border border-slate-200 rounded-full hover:border-purple-200 hover:bg-purple-50 transition-all shadow-sm"
          >
            Rating
          </button>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-purple-600 bg-white border border-slate-200 rounded-full hover:border-purple-200 hover:bg-purple-50 transition-all shadow-sm"
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
            
            <section>
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]"></span>
                Professional Bio
              </h3>
              <div className="bg-gradient-to-br from-white/80 to-white/40 border border-white p-6 rounded-3xl text-slate-600 leading-relaxed italic shadow-inner">
                {doctor?.bio ? `"${doctor.bio}"` : "No biography provided by the practitioner."}
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="space-y-5">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div><label className={infoLabelStyle}>Email</label><div className={infoValueStyle}>{doctor?.email}</div></div>
                  <div><label className={infoLabelStyle}>Phone</label><div className={infoValueStyle}>{doctor?.contact}</div></div>
                  <div className="flex gap-4">
                    <div className="flex-1"><label className={infoLabelStyle}>Experience</label><div className={infoValueStyle}>{doctor?.experienceYears} Years</div></div>
                    <div className="flex-1"><label className={infoLabelStyle}>Gender</label><div className={infoValueStyle}>{doctor?.gender}</div></div>
                  </div>
                </div>
              </section>

              <section className="space-y-5">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                  Academic Credentials
                </h3>
                <div className="p-6 bg-gradient-to-br from-white to-slate-50 border border-slate-100 rounded-3xl shadow-sm relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-3 opacity-5">
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>
                   </div>
                   <div className="text-purple-600 font-black text-xl tracking-tight uppercase">{doctor?.title || ""}</div>
                   <div className="text-slate-700 font-bold text-sm mt-1">{doctor?.institution || "Institution not provided"}</div>
                   <div className="mt-4 inline-block px-3 py-1 bg-white border border-slate-100 text-slate-400 text-[10px] font-bold rounded-lg uppercase">
                     Graduated in {doctor?.year || "N/A"}
                   </div>
                </div>

                <div>
                   <label className={infoLabelStyle}>Primary Hospital</label>
                   <div className={infoValueStyle}>{doctor?.hospitalName}</div>
                </div>
              </section>
            </div>


            <section className="pt-6 border-t border-slate-100">
               <label className={infoLabelStyle}>Practice Address</label>
               <div className="text-slate-600 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-sm font-medium">
                 {doctor?.HospitalAddress || doctor?.clinicAddress || "Address not specified."}
               </div>
            </section>

          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDocterForAll;