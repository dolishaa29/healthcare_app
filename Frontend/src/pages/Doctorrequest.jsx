import React, { useEffect, useState } from "react";
import axios from "axios";

const DoctorRequest = () => {
  const [doctors, setDoctors] = useState([]);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/doctorrequest");
      setDoctors(res.data.doctors);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleApprove = async (doc) => {
    try {
      await axios.post(import.meta.env.VITE_API_URL + "/doctorregister", {
        name: doc.name,
        email: doc.email,
        contact: doc.contact,
        specialization: doc.specialization,
        address: doc.address,
      });

      await axios.put(import.meta.env.VITE_API_URL + "/doctorpermissionupdate", {
        id: doc._id,
        permission: "approved",
      });

      alert("Doctor Approved");
      fetchDoctors();
    } catch (err) {
      console.log(err);
    }
  };

  const handleReject = async (doc) => {
    try {
      await axios.put(import.meta.env.VITE_API_URL + "/doctorpermissionupdate", {
        id: doc._id,
        permission: "rejected",
      });

      alert("Doctor Rejected");
      fetchDoctors();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Doctor Requests</h2>

      {doctors.filter((doc) => doc.permission === "pending").map((doc) => (
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
          <p><b>Certificate:</b> {doc.certificate}</p>

          <button
            onClick={() => handleApprove(doc)}
            style={{
              marginRight: "10px",
              backgroundColor: "green",
              color: "white",
              padding: "5px 10px",
            }}
          >
            Approve
          </button>

          <button
            onClick={() => handleReject(doc)}
            style={{
              backgroundColor: "red",
              color: "white",
              padding: "5px 10px",
            }}
          >
            Reject
          </button>
        </div>
      ))}
    </div>
  );
};

export default DoctorRequest;