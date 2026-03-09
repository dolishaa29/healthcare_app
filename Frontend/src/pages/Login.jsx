import React from 'react'
import { useNavigate } from 'react-router-dom'
const Login = () => {
    const navigate = useNavigate()
  return (
    <div>
      <h1>here everbody can login</h1>
      <button onClick={() => navigate('/Adminlogin')} > Admin Login </button>
      <button onClick={() => navigate('/Doctorlogin')} > Doctor Login </button>
      <button onClick={() => navigate('/Userlogin')} > User Login </button>
    </div>
  )
}

export default Login
