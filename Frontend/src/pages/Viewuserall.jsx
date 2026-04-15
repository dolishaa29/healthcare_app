import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Viewuserall = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null); 
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const fetchuser = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/userbyid/${id}`);
            const data = response.data.user;
            setUser(data);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    useEffect(() => {
      fetchuser();
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-5">
            <h1 className="text-xl font-bold">User Profile</h1>
            <hr className="my-4" />

            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Contact:</strong> {user.contact}</p>
            <p><strong>Address:</strong> {user.address}</p>
            <p><strong>Gender:</strong> {user.gender}</p>
            <p><strong>DOB:</strong> {user.dob}</p>
            <p><strong>Fathers Name:</strong> {user.fatherName}</p>
            <p><strong>Mothers Name:</strong> {user.motherName}</p>
            <p><strong>Martial Status:</strong> {user.martitalStatus}</p>
            <p><strong>Nationality:</strong> {user.nationality}</p>
            <p><strong>Blood Group:</strong> {user.bloodGroup}</p>
            <p><strong>Emergency Contact Name:</strong> {user.emergencyContactName}</p>
            <p><strong>Emergency Contact Number:</strong> {user.emergencyContactNumber}</p>
            <p><strong>Emergency Contact Relation:</strong> {user.emergencyRelation}</p>
            <p><strong>image:</strong> {user.image}</p>
        </div>
    );
}

export default Viewuserall;