import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const Viewuserall = () => {
    const {id}=useParams();

    const[user,setUser]=useState("");
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const fetchuser=async()=>
    {
      const response = await axios.get(`${API_BASE_URL}/userbyid/${id}`);
      const data=response.data.data;
      setUser(data);
    }

    useEffect(()=>
    {
      fetchuser();
    },[id]);

  return (
    <div>
      <p>{user.name}</p>
      <p>user.email</p>
    </div>
  )
}

export default Viewuserall
