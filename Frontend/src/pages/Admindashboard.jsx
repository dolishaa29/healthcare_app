import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const Admindashboard = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");

   useEffect(() => {
    fetchadminDashboard();
  }, []);

  const fetchadminDashboard = async () => {
    try {
      const response = await axios.get("http://localhost:7000/admindashboard", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get("emtoken")}`,
        },
        withCredentials: true,
      });
      setEmail(response.data.dashboard.email);
      setContact(response.data.dashboard.contact);
    } catch (error) {
      console.error("Error fetching admin dashboard:", error);
    }
  };

  return (
    <div>
      <p>Email: {email}</p>
      <p>Contact: {contact}</p>
      <h1>This is Admin Dashboard</h1>
      <button onClick={() => navigate('/Viewdoctor')} >
        View Doctor
      </button>

      <button onClick={() => navigate('/Viewusers')} > View User </button>

      <button onClick={() => navigate('/Doctorrequest')} > Doctor Requests </button>

      <button onClick={() => navigate('/Approveddoctors')} > Approved Doctors </button>

      <button onClick={() => navigate('/Rejecteddoctors')} > Rejected Doctors </button>
    </div>
  )
}

export default Admindashboard