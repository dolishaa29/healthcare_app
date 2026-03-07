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

      <button onClick={() => navigate('/Viewusers')} > View User </button>

      <button onClick={() => navigate('/Doctorrequest')} > Doctor Requests </button>

      <button onClick={() => navigate('/Approveddoctors')} > Approved Doctors </button>

      <button onClick={() => navigate('/Rejecteddoctors')} > Rejected Doctors </button>
    </div>
  )
}

export default Admindashboard