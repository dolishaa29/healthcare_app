import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState({
    name: "", email: "", contact: "", address: "",
    gender: "", dateOfBirth: "", age: "", experienceYears: "",
    hospitalName: "", clinicAddress: "", bio: "",
    specialization: [""],
    degrees: [{ title: "", institution: "", year: "" }],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchDoctorProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/doctorprofile`, {
        headers: { Authorization: `Bearer ${Cookies.get("emstoken")}` },
        withCredentials: true,
      });
      setDoctor(response.data.doctors);
    } catch (err) {
      setError("Failed to fetch profile details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctor((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecializationChange = (index, value) => {
    const updated = [...doctor.specialization];
    updated[index] = value;
    setDoctor((prev) => ({ ...prev, specialization: updated }));
  };

  const handleDegreeChange = (index, field, value) => {
    const updated = [...doctor.degrees];
    updated[index][field] = value;
    setDoctor((prev) => ({ ...prev, degrees: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/updatedoctor`, doctor, {
        headers: { Authorization: `Bearer ${Cookies.get("emstoken")}` },
        withCredentials: true,
      });
      if (response.status === 200) alert("Profile Updated Successfully!");
    } catch (err) {
      setError("Failed to update profile.");
    }
  };

  const inputStyle = "w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 transition-all shadow-sm";
  const labelStyle = "block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1";

  return (
    <div className="min-h-screen w-100% bg-[#f8fafc] bg-[radial-gradient(ellipse_at_top,_#f5f3ff,_#f8fafc)] font-sans py-12 px-4 relative overflow-x-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100/50 blur-[100px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/50 blur-[100px] rounded-full -z-10" />

      <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-2xl rounded-[2.5rem] border border-white shadow-[0_30px_60px_-15px_rgba(147,51,234,0.08)] p-8 md:p-12">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Doctor <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Profile</span>
            </h1>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mt-1">Manage your medical identity</p>
          </div>
          <button 
            onClick={() => navigate("/changepassword")}
            className="px-5 py-2 text-sm font-bold text-purple-600 border border-purple-200 rounded-full hover:bg-purple-50 transition-all"
          >
            Change Password
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <section>
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span> Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelStyle}>Full Name</label>
                  <input name="name" value={doctor.name} onChange={handleChange} className={inputStyle} placeholder="Dr. Smith" />
                </div>
                <div>
                  <label className={labelStyle}>Email Address</label>
                  <input name="email" value={doctor.email} onChange={handleChange} className={inputStyle} placeholder="doctor@aurahealth.com" />
                </div>
                <div>
                  <label className={labelStyle}>Contact No.</label>
                  <input name="contact" value={doctor.contact} onChange={handleChange} className={inputStyle} placeholder="+91 00000 00000" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelStyle}>Gender</label>
                        <input name="gender" value={doctor.gender} onChange={handleChange} className={inputStyle} placeholder="Male/Female" />
                    </div>
                    <div>
                        <label className={labelStyle}>Age</label>
                        <input name="age" value={doctor.age} onChange={handleChange} className={inputStyle} placeholder="Age" />
                    </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Professional Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelStyle}>Years of Experience</label>
                  <input name="experienceYears" value={doctor.experienceYears} onChange={handleChange} className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Hospital Name</label>
                  <input name="hospitalName" value={doctor.hospitalName} onChange={handleChange} className={inputStyle} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelStyle}>Clinic Address</label>
                  <input name="clinicAddress" value={doctor.clinicAddress} onChange={handleChange} className={inputStyle} />
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <section>
                <h3 className={labelStyle}>Specializations</h3>
                {doctor.specialization.map((spec, index) => (
                  <input key={index} value={spec} onChange={(e) => handleSpecializationChange(index, e.target.value)} className={`${inputStyle} mb-2`} placeholder="e.g. Cardiology" />
                ))}
              </section>

              <section>
                <h3 className={labelStyle}>Academic Degrees</h3>
                {doctor.degrees.map((deg, index) => (
                  <div key={index} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3 mb-3">
                    <input value={deg.title} onChange={(e) => handleDegreeChange(index, "title", e.target.value)} className={inputStyle} placeholder="Degree Title" />
                    <div className="grid grid-cols-2 gap-2">
                        <input value={deg.institution} onChange={(e) => handleDegreeChange(index, "institution", e.target.value)} className={inputStyle} placeholder="Institution" />
                        <input value={deg.year} onChange={(e) => handleDegreeChange(index, "year", e.target.value)} className={inputStyle} placeholder="Year" />
                    </div>
                  </div>
                ))}
              </section>
            </div>

            <section>
                <label className={labelStyle}>Professional Bio</label>
                <textarea name="bio" value={doctor.bio} onChange={handleChange} className={`${inputStyle} min-h-[120px] resize-none`} placeholder="Tell us about your medical journey..." />
            </section>

            {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

            <div className="pt-6">
              <button 
                type="submit" 
                className="w-full md:w-max px-12 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-purple-200 transform transition-all active:scale-[0.98] hover:opacity-95"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;