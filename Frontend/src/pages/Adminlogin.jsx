import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Adminlogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:7000/adminlogin",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200 && response.data.token) {
      
        Cookies.set("emtoken", response.data.token, { expires: 1 });

        setMessage("Login Successful");
        navigate("/Admindashboard");
      } else {
        setMessage(response.data.message || "Invalid login credentials");
      }

    } catch (err) {
      console.error("Login Error:", err.response ? err.response.data : err.message);
      setMessage(err.response?.data?.message || "Login failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Password:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p>{message}</p>
    </div>
  );
};

export default Adminlogin;