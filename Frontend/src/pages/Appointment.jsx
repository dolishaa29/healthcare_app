import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const Appointment = () => {

  const [doctors, setDoctors] = useState([]);
  const [doctorid, setDoctorid] = useState("");
  const [doctormail, setDoctormail] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const response = await axios.get(import.meta.env.VITE_API_URL + "/viewdoctors");

        if (response.status === 200) {
          setDoctors(response.data.doctors);
        } else {
          setMessage("Failed to fetch doctors");
        }

      } catch (err) {
        console.error(
          "Fetch Error:",
          err.response ? err.response.data : err.message
        );
        setMessage(err.response?.data?.message || "Error while fetching doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const sendAppointmentRequest = async () => {
    try {

      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/appointrequest",
        {
          doctorid,
          doctormail,
          description,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Cookies.get("token")}`,
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setMessage("Appointment Request Sent Successfully");
      } else {
        setMessage(res.data.message || "Request Failed");
      }

    } catch (error) {
      console.error(error);
      setMessage("Error while sending appointment request");
    }
  };

  return (
    <div>

      <h1>Book Appointment</h1>

      {loading && <p>Loading Doctors...</p>}

      <select
        onChange={(e) => {
          const doc = doctors.find((d) => d._id === e.target.value);
          setDoctorid(doc._id);
          setDoctormail(doc.email);
        }}
      >
        <option>Select Doctor</option>

        {doctors.map((doc) => (
          <option key={doc._id} value={doc._id}>
            {doc.name}
          </option>
        ))}
      </select>

      <br /><br />

      <textarea
        placeholder="Enter description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br /><br />

      <button onClick={sendAppointmentRequest}>
        Send Appointment Request
      </button>

      <p>{message}</p>

    </div>
  );
};

export default Appointment;