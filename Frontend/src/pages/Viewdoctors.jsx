import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:7000/viewdoctors");

        if (response.status === 200) {
          setDoctors(response.data.doctors);
        } else {
          setMessage("Failed to fetch doctors");
        }

      } catch (err) {
        console.error("Fetch Error:", err.response ? err.response.data : err.message);
        setMessage(err.response?.data?.message || "Error while fetching doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div>
      <h2>View Doctors</h2>

      {loading && <p>Loading...</p>}
      {message && <p>{message}</p>}

      {doctors.map((doctor) => (
        <div key={doctor._id}>
          <p><strong>Name:</strong> {doctor.name}</p>
          <p><strong>Email:</strong> {doctor.email}</p>
          <p><strong>Specialization:</strong> {doctor.specialization}</p>
          <p><strong>Contact:</strong> {doctor.contact}</p>
          <p><strong>Address:</strong> {doctor.address}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default ViewDoctors;