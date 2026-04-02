import React from 'react'

const DoctorProfile = () => {
    const doctorprofile = async()=>
    {
        try {
            const response=await axios.get('http://localhost:7000/doctorprofile')
            console.log(response.data.doctor);
            setdoctor(response.data.doctor);
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div>
      
    </div>
  )
}

export default DoctorProfile
