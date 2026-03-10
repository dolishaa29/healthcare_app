import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const Userviewapp = () => {
   const [appointments, setappointments] = useState([]);
 
   useEffect(() => {
     fetchAppointments();
   }, []);
 
   const fetchAppointments = async () => {
     try {
       const response = await axios.get("http://localhost:7000/userviewapp", {
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${Cookies.get("token")}`,
         },
         withCredentials: true,
       });
 
       console.log(response.data.appointments);
       setappointments(response.data.appointments);
     } catch (error) {
       console.log(error);
     }
   };
 
   const isTimeReached = (date, time) => {
     const now = new Date();
 
     const appointmentDateTime = new Date(`${date}T${time}`);
 
     return now >= appointmentDateTime;
   };
 
   return (
     <div>
       <h2>Scheduled Appointments</h2>
 
       {appointments.map((app) => {
         const active = isTimeReached(app.date, app.time);
 
         return (
           <div
             key={app._id}
             style={{
               border: "1px solid #ccc",
               padding: "10px",
               marginBottom: "10px",
             }}
           >
             <p>
               <strong>Doctor Id:</strong> {app.doctorid}
             </p>
 
             <p>
               <strong>Doctor Email:</strong> {app.doctormail}
             </p>
 
             <p>
               <strong>Appointment Date:</strong>{" "}
               {new Date(app.date).toLocaleDateString()}
             </p>
 
             <p>
               <strong>Appointment Time:</strong> {app.time}
             </p>
 
             <p>
               <strong>Description:</strong> {app.description}
             </p>
 
             <button disabled={!active}>
               {active ? "Start Appointment" : "Waiting for Time"}
             </button>
           </div>
         );
       })}
     </div>
   );
}

export default Userviewapp
