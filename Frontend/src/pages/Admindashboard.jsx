import React from 'react'
import { useNavigate } from 'react-router-dom'

const Admindashboard = () => {
  const navigate = useNavigate()

  return (
    <div>
      <h1>This is Admin Dashboard</h1>

      <button onClick={() => navigate('/Doctorregister')}>
        Doctor Register
      </button>

      <button onClick={() => navigate('/Viewdoctor')} >
        View Doctor
      </button>
    </div>
  )
}

export default Admindashboard