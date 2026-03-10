import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const ViewAppointment = () => {

  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get("http://localhost:7000/viewappointment", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get("emtoken")}`,
        },
        withCredentials: true,
      });

      setAppointments(res.data.appointments);

    } catch (error) {
      console.log(error);
    }
  };

  const handleAcceptRequest = async (id) => {
    try {
      await axios.post("http://localhost:7000/appointmentstatus", {
        id: id,
        status: "approved"
      });

      await axios.post("http://localhost:7000/sendmail", {

      });

      alert("Appointment Accepted");
      fetchAppointments();

    } catch (error) {
      console.log(error);
    }
  };

  const rejectRequests = async (id) => {
    try {
      await axios.post("http://localhost:7000/appointmentstatus", {
        id: id,
        status: "rejected"
      });

      alert("Appointment Rejected");
      fetchAppointments();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Appointments</h2>

      {appointments.map((app) => (
        <div
          key={app._id}
          style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}
        >
          <p>Name: {app.name}</p>
          <p>Status: {app.status}</p>

          <button
            onClick={() => handleAcceptRequest(app._id)}
            style={{
              marginRight: "10px",
              background: "green",
              color: "#fff",
              padding: "5px 10px",
              border: "none",
              cursor: "pointer"
            }}
          >
            Approve
          </button>

          <button
            onClick={() => rejectRequests(app._id)}
            style={{
              background: "red",
              color: "#fff",
              padding: "5px 10px",
              border: "none",
              cursor: "pointer"
            }}
          >
            Reject
          </button>
        </div>
      ))}
    </div>
  );
};

export default ViewAppointment;