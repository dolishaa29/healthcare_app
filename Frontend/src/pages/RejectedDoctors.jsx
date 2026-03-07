import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';

const RejectedDoctors = () => { 
  const [doctors, setDoctors] = useState([]);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:7000/doctorrequest");
      setDoctors(res.data.doctors);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);


  return (
   <div style={{ padding: "20px" }}>
      <h2>Doctor Rejected</h2>

      {doctors.filter((doc) => doc.permission === "rejected").map((doc) => (
        <div
          key={doc._id}
          style={{
            border: "1px solid gray",
            padding: "15px",
            marginBottom: "10px",
          }}
        >
          <p><b>Name:</b> {doc.name}</p>
          <p><b>Email:</b> {doc.email}</p>
          <p><b>Specialization:</b> {doc.specialization}</p>
          <p><b>Contact:</b> {doc.contact}</p>
          <p><b>Address:</b> {doc.address}</p>

        </div>
      ))}
    </div>
  );

}

export default RejectedDoctors
