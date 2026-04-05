import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


const ProfileDocterForAll = () => {

    const { id } = useParams();
    console.log("Doctor ID from URL:", id);
    const [doctor, setDoctor] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDoctorProfile = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/doctorprofileview/${id}`);
            setDoctor(response.data.doctor);
        } catch (err) {
            console.error("Error fetching doctor profile:", err.response ? err.response.data : err.message);
            setError(err.response?.data?.message || "Error while fetching doctor profile");
        }
    };

    useEffect(() => {
        fetchDoctorProfile();
    }, [id]);


  return (
    <div>
      {loading && <p>Loading doctor profile...</p>}
      {error && <p style={{color: 'red'}}>Error: {error}</p>}
      {doctor && (
        <>
          Email: {doctor.email}<br/>
          Name: {doctor.name}<br/>
          Specialization: {doctor.specialization}<br/>
          Contact: {doctor.contact}<br/>
          Address: {doctor.address}<br/>
          gender: {doctor.gender}<br/>
          dateOfBirth: {doctor.dateOfBirth}<br/>
          age: {doctor.age}<br/>
          experienceYears: {doctor.experienceYears}<br/>
          hospitalName: {doctor.hospitalName}<br/>
          clinicAddress: {doctor.clinicAddress}<br/>
          bio: {doctor.bio}<br/>
          degrees: {doctor.degrees && doctor.degrees.map(degree => (
            <div key={degree._id}>
              Title: {degree.title}, Institution: {degree.institution}, Year: {degree.year}
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export default ProfileDocterForAll
