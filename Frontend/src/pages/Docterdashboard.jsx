import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const Docterdashboard = () => {
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

    const fetchDashboard = async () => {setLoading(true);
      try {
        const response = await axios.get(import.meta.env.VITE_API_URL + "/doctordashboard", {
          headers: {
                     "Content-Type": "application/json",
                     "Authorization": `Bearer ${Cookies.get("emstoken")}`,
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
      <h1>This is Doctor Dashboard</h1>
      {loading && <p>Loading...</p>}
      {message && <p>{message}</p>}
        <p>Email:{email}</p>
        <p>Contact:{contact}</p>
        <p>Address:{address}</p>
        <p>Name:{name}</p>
         <button onClick={() => navigate('/doctorviewapp')} > View Appointments </button>
    </div>
  )
}

export default Docterdashboard
