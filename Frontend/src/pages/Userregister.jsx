import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Userregister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !name || !contact || !address) {
      setMessage("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:7000/userregister", 
        {
          email,
          password,
          name,
          contact,
          address,
        }
      );

      if (response.status === 200) {
        setMessage("User Registered Successfully");
        navigate("/Userdashboard"); 
      } else {
        setMessage(response.data.message || "Registration Failed");
      }
    } catch (err) {
      console.error("Register Error:", err.response ? err.response.data : err.message);
      setMessage(err.response?.data?.message || "Error while registering");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>User Register</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label><br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

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

        <div>
          <label>Contact:</label><br />
          <input
            type="number"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>

        <div>
          <label>Address:</label><br />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p>{message}</p>
    </div>
  );
};

export default Userregister;