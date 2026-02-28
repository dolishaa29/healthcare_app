import React, { useState } from "react";
import axios from "axios";

const Adminregister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !contact) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(`http://localhost:7000/adminregister`, {
        email,
        password,
        contact,
      });

      if (res.data.success) {
        setMessage("Admin Registered Successfully ");
      } else {
        setMessage(res.data.message || "Registration Failed");
      }
    } catch (error) {
      setMessage("Error while registering ");
    }
  };

  return (
    <div>
      <h2>Admin Register (Test)</h2>

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

        <div>
          <label>Contact:</label><br />
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>

        <br />
        <button type="submit">Register</button>
      </form>

      <p>{message}</p>
    </div>
  );
};

export default Adminregister;