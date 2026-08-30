import React, { useState, useEffect } from 'react';
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
    <div className="group relative bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 w-full max-w-sm overflow-hidden flex flex-col">
      
      <div className="relative h-[320px] w-full overflow-hidden p-3">
        {image ? (
          <img 
            src={image} 
            alt={doctor.name} 
            className="w-full h-full object-cover rounded-[2rem] transition-transform duration-1000 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-slate-50 rounded-[2rem] flex items-center justify-center">
            <span className="text-slate-300 text-[10px] font-bold tracking-widest uppercase">No Profile</span>
          </div>
        )}


        <div className="absolute top-7 right-7">
          <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-sm border border-white/40">
            <p className="text-[10px] font-bold text-slate-800 tracking-tight">
              {doctor.experienceYears}Y+ EXP
            </p>
          </div>
        </div>



        <button 
          onClick={() => navigate(`/doctorprofileview/${doctor._id}`)}
          className="absolute bottom-7 right-7 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/50 hover:bg-indigo-600 hover:text-white transition-all group/btn"
          title="View Profile"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
        </button>
      </div>




      <div className="px-7 pt-2 pb-7">
        <div className="flex flex-col mb-5">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-indigo-500 tracking-[0.2em] uppercase">
              {doctor.specialization || "Generalist"}
            </span>
            
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Dr. {doctor.name}
          </h3>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5 truncate">
            {doctor.hospitalName || "Partner Health"} • {doctor.clinicAddress || "Central Clinic"}
          </p>
        </div>




        {isBooking ? (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <textarea 
              className="w-full p-4 rounded-2xl bg-slate-50 border-none text-[12px] text-slate-700 placeholder:text-slate-300 focus:ring-1 focus:ring-slate-100 transition-all resize-none"
              rows="2"
              placeholder="Brief description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex gap-2">
              <button 
                onClick={() => setIsBooking(false)}
                className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest"
              >
                Back
              </button>
              <button
                onClick={handleFinalizeBooking}
                disabled={loading}
                className="flex-grow py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] uppercase tracking-[0.15em] active:scale-95 transition-colors"
              >
                {loading ? "..." : "Confirm"}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleAction}
            className="w-full py-4 rounded-[1.5rem] bg-indigo-600 text-white font-bold text-[11px] uppercase tracking-[0.2em] shadow-sm hover:bg-indigo-700 transition-all active:scale-95"
          >
            Make Appointment
          </button>
        )}
      </div>
    </div>
  );
};

export default DoctorCard;