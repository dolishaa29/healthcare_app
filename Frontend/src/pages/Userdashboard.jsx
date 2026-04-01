import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Userdashboard = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name , setName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const response = await axios.get(import.meta.env.VITE_API_URL + "/userdashboard", {
          headers: {
                     "Content-Type": "application/json",
                     "Authorization": `Bearer ${Cookies.get("token")}`,
                   },
                   withCredentials: true,
        });
        if (response.status === 200) {
          setEmail(response.data.dashboard.email);
          setContact(response.data.dashboard.contact);
          setAddress(response.data.dashboard.address);
          setName(response.data.dashboard.name);
        }
      } catch (err) {
        console.error("Dashboard Error:", err.response ? err.response.data : err.message);
        setMessage(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };


  return (
     
    <div> 
      {loading && <p>Loading...</p>}
      {message && <p>{message}</p>}
        <p>Email:{email}</p>
        <p>Contact:{contact}</p>
        <p>Address:{address}</p>
        <p>Name:{name}</p>
      <h1>User Dashboard</h1>
        <button onClick={() => navigate('/Appointment')} > Book Appointment </button>
        <button onClick={() => navigate('/userviewapp')} > View Appointments </button>
    </div>
  )
}

export default Userdashboard
