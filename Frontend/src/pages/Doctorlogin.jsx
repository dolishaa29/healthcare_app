import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Doctorlogin = () => {
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
        "http://localhost:7000/doctorlogin",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200 && response.data.token) {
        Cookies.set("emstoken", response.data.token, { expires: 1 });

        setMessage("Login Successful");
        navigate("/Doctordashboard");
      } else {
        setMessage(response.data.message || "Invalid Credentials");
      }

    } catch (err) {
      console.error("Login Error:", err.response ? err.response.data : err.message);
      setMessage(err.response?.data?.message || "Login Failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Doctor Login</h2>

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

export default Doctorlogin;