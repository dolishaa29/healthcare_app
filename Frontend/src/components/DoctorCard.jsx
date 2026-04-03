import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleViewMore = () => {
    navigate(`/doctor/${doctor._id}`);
  };

  const handleFinalizeBooking = async () => {
    if (!description) return alert("Please enter a description");
    
    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/appointrequest`, {
        doctorid: doctor._id,
        description: description,
      },
    {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Cookies.get("token")}`,
        },
        withCredentials: true,
    });

      if (response.status === 200) {
        alert("Appointment Booked Successfully!");
        setShowModal(false);
        setDescription("");
      }
    } catch (err) {
      console.error(err);
      alert("Error booking appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-md border border-gray-100 p-6 w-full max-w-sm transition-all duration-300 hover:shadow-xl hover:border-purple-200 flex flex-col h-full">
      <div className="mb-4">
        <span className="px-3 py-1 text-[11px] font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full uppercase tracking-wider">
          {doctor.specialization || "General Physician"}
        </span>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-800 mb-1">{doctor.name}</h3>
      <p className="text-sm text-gray-500 font-medium mb-4 italic">
        {doctor.experienceYears} Years of Experience
      </p>

      <div className="space-y-2 mb-6 flex-grow">
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <span className="font-semibold text-purple-700">🏥 Hospital:</span> 
          {doctor.hospitalName || "Not Specified"}
        </p>
        <p className="text-sm text-gray-600">
           <span className="font-semibold text-purple-700">📍 Address:</span> 
           {doctor.clinicAddress || doctor.address || "Address not available"}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 mt-auto">
        <button 
          onClick={() => setShowModal(true)} 
          className="flex-[2] bg-gradient-to-r from-purple-700 to-indigo-600 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg hover:opacity-90 transition-all text-sm active:scale-95"
        >
          Book Appointment
        </button>
        
        <button 
          onClick={handleViewMore}
          className="text-purple-700 font-bold text-sm hover:underline underline-offset-4 transition-all"
        >
          View More
        </button>
      </div>

      {showModal && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl z-20 flex flex-col p-6 animate-in fade-in zoom-in duration-300">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-gray-800">Booking Details</h4>
            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 text-xl">×</button>
          </div>
          
          <p className="text-xs text-gray-500 mb-2">Write a brief description of your issue:</p>
          <textarea 
            className="w-full border border-purple-100 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50/30 flex-grow resize-none"
            placeholder="e.g. Fever since 2 days..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex gap-2 mt-4">
            <button 
              disabled={loading}
              onClick={handleFinalizeBooking}
              className="flex-1 bg-purple-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-purple-700 transition-all disabled:opacity-50"
            >
              {loading ? "Finalizing..." : "Finalize Booking"}
            </button>
            <button 
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-500 font-bold text-sm hover:bg-gray-100 rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorCard;