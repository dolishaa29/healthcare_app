import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();
  const [isBooking, setIsBooking] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAction = () => {
    if (!isBooking) {
      setIsBooking(true);
    } else {
      handleFinalizeBooking();
    }
  };

  const handleFinalizeBooking = async () => {
    if (!description) return alert("Please enter a description");
    
    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/appointrequest`, {
        doctorid: doctor._id,
        description: description,
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get("token")}`,
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        alert("Appointment Booked Successfully!");
        setIsBooking(false);
        setDescription("");
      }
    } catch (err) {
      console.error(err);
      alert("Error booking appointment");
    } finally {
      setLoading(false);
    }
  };

  const handleViewMore = () => {
    navigate(`/doctorprofileview/${doctor._id}`);
  };

  return (
    <div>
      <div>
        <span>{doctor.specialization || "Physician"}</span>
        <span>Available</span>
      </div>
      
      <div>
        <h3>{doctor.name}</h3>
        <p>{doctor.experienceYears} Years of Expertise</p>
      </div>

      <div>
        <div>
          <span>🏥 Hospital:</span>
          <p>{doctor.hospitalName || "Global Health Care"}</p>
        </div>

        <div>
          <span>📍 Address:</span>
          <p>{doctor.clinicAddress || doctor.address || "Location not updated"}</p>
        </div>
      </div>

      {isBooking && (
        <div>
          <label>Describe your health concern</label>
          <textarea 
            placeholder="How can we help you today?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button onClick={() => setIsBooking(false)}>
            CANCEL REQUEST
          </button>
        </div>
      )}

      <div>
        <button onClick={handleAction} disabled={loading}>
          {loading ? "Processing..." : isBooking ? "Confirm Booking" : "Book Appointment"}
        </button>
        
        {!isBooking && (
          <button onClick={handleViewMore}>
            View Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default DoctorCard;