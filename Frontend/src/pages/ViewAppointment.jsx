import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const ViewAppointment = () => {

  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const res = await axios.get("http://localhost:7000/viewappointment",{
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Cookies.get("emtoken")}`,
      },
      withCredentials: true,
    });
     
    setAppointments(res.data.appointments);
  };

  const handleRequest = async (id, type) => {
    try {
      await axios.post("http://localhost:7000/appointmentstatus", {
        id: id,
        status: type
      });

      alert(`Appointment ${type}`);
      fetchAppointments();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Appointments</h2>

      {appointments.map((app) => (
        <div key={app._id} style={{border:"1px solid #ccc", padding:"10px", margin:"10px"}}>

          <p>Name: {app.name}</p>
          <p>Status: {app.status}</p>

          <button
            onClick={() => handleRequest(app._id, "accept")}
            style={{marginRight:"10px", background:"green", color:"#fff"}}
          >
            Approve
          </button>

          <button
            onClick={() => handleRequest(app._id, "reject")}
            style={{background:"red", color:"#fff"}}
          >
            Reject
          </button>

        </div>
      ))}
    </div>
  );
};

export default ViewAppointment;