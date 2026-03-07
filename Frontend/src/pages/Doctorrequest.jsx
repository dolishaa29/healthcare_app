import React, { useEffect, useState } from "react";
import axios from "axios";

const DoctorRequest = () => {
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

  const handleApprove = async (doc) => {
    try {
      await axios.post("http://localhost:7000/doctorregister", {
        name: doc.name,
        email: doc.email,
        password: doc.password,
        contact: doc.contact,
        specialization: doc.specialization,
        address: doc.address,
      });

      await axios.put("http://localhost:7000/doctorpermissionupdate", {
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
      await axios.put("http://localhost:7000/doctorpermissionupdate", {
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