import React, { useEffect, useState } from "react";
import axios from "axios";

const Viewusers = () => {

  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const fetchUsers = async () => {
      setLoading(true);

      try {
        const response = await axios.get("http://localhost:7000/viewusers");

        if (response.status === 200) {
          setUsers(response.data.users);
        } else {
          setMessage("Failed to fetch users");
        }

      } catch (err) {
        console.error("Fetch Error:", err.response ? err.response.data : err.message);
        setMessage(err.response?.data?.message || "Error while fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

  }, []);

  return (
    <div>
      <h2>View Users</h2>

      {loading && <p>Loading...</p>}
      {message && <p>{message}</p>}

      {users.map((user) => (
        <div key={user._id}>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Contact:</strong> {user.contact}</p>
          <p><strong>Address:</strong> {user.address}</p>
          <hr />
        </div>
      ))}

    </div>
  );
};

export default Viewusers;