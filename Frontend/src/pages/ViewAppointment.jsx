import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const ViewAppointment = () => {

  const [appointments, setAppointments] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {

      const res = await axios.get("http://localhost:7000/viewappointment", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("emtoken")}`,
        },
        withCredentials: true,
      });

      setAppointments(res.data.appointments);

    } catch (error) {
      console.log(error);
    }
  };


  const openApproveModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const confirmAppointment = async () => {
    try {

      const sendData = {
        ...selectedAppointment,
        date: date,
        time: time
      };

      await axios.post(
        "http://localhost:7000/approveappointment",
        sendData
      );

      await axios.put("http://localhost:7000/appointmentstatus", {
        id: selectedAppointment._id,
        status: "approved"
      });

      alert("Appointment Approved");

      setShowModal(false);
      setDate("");
      setTime("");

      fetchAppointments();

    } catch (error) {
      console.log(error);
    }
  };

  const rejectRequests = async (id) => {
    try {

      await axios.put("http://localhost:7000/appointmentstatus", {
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
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            margin: "10px"
          }}
        >

          <p>Name: {app.name}</p>
          <p>Email: {app.email}</p>
          <p>Doctor ID: {app.doctorid}</p>
          <p>Doctor Email: {app.doctormail}</p>
          <p>Description: {app.description}</p>
          <p>Status: {app.status}</p>

          <button
            onClick={() => openApproveModal(app)}
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

      {showModal && (

        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >

          <div
            style={{
              background: "#fff",
              padding: "20px",
              width: "300px",
              borderRadius: "5px"
            }}
          >

            <h3>Select Date & Time</h3>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "5px"
              }}
            />

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "5px"
              }}
            />

            <button
              onClick={confirmAppointment}
              style={{
                background: "green",
                color: "#fff",
                padding: "5px 10px",
                border: "none",
                marginRight: "10px",
                cursor: "pointer"
              }}
            >
              Confirm
            </button>

            <button
              onClick={() => setShowModal(false)}
              style={{
                background: "gray",
                color: "#fff",
                padding: "5px 10px",
                border: "none",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default ViewAppointment;