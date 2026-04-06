import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const DoctorCard = ({ doctor, image }) => {
  const navigate = useNavigate();
  const [isBooking, setIsBooking] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAction = () => {
    if (!isBooking) setIsBooking(true);
    else handleFinalizeBooking();
  };

  const handleFinalizeBooking = async () => {
    if (!description) return alert("Please enter a description");
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/appointrequest`, 
        { doctorid: doctor._id, description }, 
        { headers: { "Authorization": `Bearer ${Cookies.get("token")}` }, withCredentials: true }
      );
      alert("Appointment Booked Successfully!");
      setIsBooking(false);
      setDescription("");
    } catch (err) {
      alert("Error booking appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group relative bg-white rounded-[2.5rem] p-3 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(126,34,206,0.1)] transition-all duration-500 w-full max-w-sm overflow-hidden">
      
      <div className="relative w-full h-64 overflow-hidden rounded-[2rem] bg-slate-50">
        {image ? (
          <img 
            src={image} 
            alt={doctor.name} 
            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            <span className="text-slate-300 font-medium text-[10px] tracking-[0.2em]">NO PROFILE</span>
          </div>
        )}

        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <div className="bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/50 shadow-sm">
            <p className="text-[9px] font-black text-slate-800 tracking-tighter">
              {doctor.experienceYears}Y+ EXPERIENCE
            </p>
          </div>
          
        </div>
      </div>

      <div className="pt-5 pb-2 px-4">
        <div className="flex flex-col gap-1 mb-4">
          <span className="text-[10px] font-bold text-purple-500 tracking-widest uppercase">
            {doctor.specialization || "General Medicine"}
          </span>
          <div className="flex items-center gap-1.5">
            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">
              {doctor.name}
            </h3>
            <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
            <p className="text-xs font-medium text-slate-500 truncate">{doctor.hospitalName || "Partner Hospital"}</p>
          </div>
          <p className="text-[11px] font-medium text-slate-400 pl-3 leading-relaxed">
            {doctor.clinicAddress || "Central Clinic, Main Branch"}
          </p>
        </div>
        {isBooking && (
          <div className="mb-4 animate-in slide-in-from-top-2 duration-500">
            <textarea 
              className="w-full p-4 rounded-2xl bg-slate-50 border-none text-sm text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-100 transition-all resize-none"
              rows="2"
              placeholder="Tell us your concern..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button 
              onClick={() => setIsBooking(false)}
              className="mt-2 text-[10px] font-bold text-slate-400 hover:text-rose-500 w-full transition-colors uppercase tracking-widest"
            >
              Cancel
            </button>
          </div>
        )}

        <div className="flex gap-2">
          {!isBooking && (
             <button 
                onClick={() => navigate(`/doctorprofileview/${doctor._id}`)} 
                className="p-4 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
             </button>
          )}
          
          <button 
            onClick={handleAction} 
            disabled={loading}
            className={`flex-grow py-4 rounded-2xl font-bold text-[11px] tracking-[0.1em] transition-all shadow-sm ${
              isBooking 
              ? "bg-slate-900 text-white hover:shadow-xl shadow-slate-200" 
              : "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-xl shadow-purple-200"
            } disabled:bg-slate-200 active:scale-95 uppercase`}
          >
            {loading ? "Please wait..." : isBooking ? "Confirm Booking" : "Make Appointment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
