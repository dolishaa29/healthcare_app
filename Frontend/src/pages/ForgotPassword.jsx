import React from 'react'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useParams } from 'react-router-dom'

const ForgotPassword = () => {
    const role = useParams().role
    console.log(role)
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!email) {
            setMessage("Please enter your email");
            setLoading(false);
            return;
        }
        
    }


  return (
    <div>
      
    </div>
  )
}

export default ForgotPassword
