import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState({
    name: "", email: "", contact: "", gender: "", 
    experienceYears: "", hospitalName: "", HospitalAddress: "", 
    bio: "", specialization: "", title: "", institution: "", 
    year: "", image: "" 
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const fetchDoctorProfile = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/doctorprofile`, {
        headers: { Authorization: `Bearer ${Cookies.get("emstoken")}` },
        withCredentials: true,
      });
      setDoctor(data.doctors);
      if (data.doctors.image) {
        const filename = data.doctors.image.split(/[\\/]/).pop();
        setImagePreview(`${API_BASE_URL}/images/${filename}`);
      }
    } catch (err) {
      setError("Failed to fetch profile details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDoctorProfile(); }, []);

  const handleChange = (e) => {
    try{
    const { name, value, type, files } = e.target;
    
    if (type === "file") {
      const file = files[0];
      if (file) {
        setImageFile(file); 
        setImagePreview(URL.createObjectURL(file)); 
      }
    } else {
      setDoctor((prev) => ({ ...prev, [name]: value }));
    }
  }
  catch(err)
  {
    console.log(err);
  }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("name", doctor.name || "");
    formData.append("email", doctor.email || "");
    formData.append("contact", doctor.contact || "");
    formData.append("gender", doctor.gender || "");
    formData.append("specialization", doctor.specialization || "");
    formData.append("experienceYears", doctor.experienceYears || "");
    formData.append("hospitalName", doctor.hospitalName || "");
    formData.append("HospitalAddress", doctor.HospitalAddress || "");
    formData.append("bio", doctor.bio || "");
    formData.append("title", doctor.title || "");
    formData.append("institution", doctor.institution || "");
    formData.append("year", doctor.year || "");

    if (imageFile) {
      formData.append("image", imageFile);
    } else {
      formData.append("image", doctor.image );
    }

    try {
      await axios.put(`${API_BASE_URL}/updatedoctor`, formData, {
        headers: { 
          Authorization: `Bearer ${Cookies.get("emstoken")}`,
          'Content-Type': 'multipart/form-data' 
        },
        withCredentials: true,
      });
      alert("Profile Updated Successfully!");
      setImageFile(null); 
      fetchDoctorProfile(); 
    } catch (err) {
      setError("Failed to update profile.");
    }
  };

  const inputStyle = "w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 transition-all shadow-sm";
  const labelStyle = "block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1";

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] bg-[radial-gradient(ellipse_at_top,_#f5f3ff,_#f8fafc)] font-sans py-12 px-4 relative overflow-x-hidden">
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
          <button type="button" onClick={() => navigate("/changepassword")} className="px-5 py-2 text-sm font-bold text-purple-600 border border-purple-200 rounded-full hover:bg-purple-50 transition-all">
            Change Password
          </button>
        </div>

        {loading && !doctor.name ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div></div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <section className="text-center">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Profile Picture
              </h3>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 rounded-full border-4 border-purple-200 overflow-hidden bg-slate-100 shadow-inner">
                  {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" alt="Profile" /> : <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xs uppercase">No Photo</div>}
                </div>
                <label className="cursor-pointer px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-lg hover:bg-purple-700 transition-colors">
                  <input type="file" accept="image/*" name="image" onChange={handleChange} className="hidden" />
                  Update Photo
                </label>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span> Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><label className={labelStyle}>Full Name</label><input name="name" value={doctor.name || ""} onChange={handleChange} className={inputStyle} /></div>
                <div><label className={labelStyle}>Email Address</label><input name="email" value={doctor.email || ""} onChange={handleChange} className={inputStyle} /></div>
                <div><label className={labelStyle}>Contact No.</label><input name="contact" value={doctor.contact || ""} onChange={handleChange} className={inputStyle} /></div>
                <div>
                  <label className={labelStyle}>Gender</label>
                  <select name="gender" value={doctor.gender || ""} onChange={handleChange} className={inputStyle}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Professional Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><label className={labelStyle}>Years of Experience</label><input name="experienceYears" value={doctor.experienceYears || ""} onChange={handleChange} className={inputStyle} /></div>
                <div><label className={labelStyle}>Specialization</label><input name="specialization" value={doctor.specialization || ""} onChange={handleChange} className={inputStyle} /></div>
                <div><label className={labelStyle}>Hospital Name</label><input name="hospitalName" value={doctor.hospitalName || ""} onChange={handleChange} className={inputStyle} /></div>
                <div className="md:col-span-2"><label className={labelStyle}>Hospital Address</label><input name="HospitalAddress" value={doctor.HospitalAddress || ""} onChange={handleChange} className={inputStyle} /></div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> Academic Degree
              </h3>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                <input name="title" value={doctor.title || ""} onChange={handleChange} className={inputStyle} placeholder="Degree (e.g. MBBS)" />
                <div className="grid grid-cols-2 gap-2">
                  <input name="institution" value={doctor.institution || ""} onChange={handleChange} className={inputStyle} placeholder="Institution" />
                  <input name="year" value={doctor.year || ""} onChange={handleChange} className={inputStyle} placeholder="Year" />
                </div>
              </div>
            </section>

            <section>
              <label className={labelStyle}>Professional Bio</label>
              <textarea name="bio" value={doctor.bio || ""} onChange={handleChange} className={`${inputStyle} min-h-[120px] resize-none`} placeholder="Tell us about your medical journey..." />
            </section>

            {error && <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl text-center">{error}</div>}

            <div className="pt-6">
              <button type="submit" className="w-full md:w-max px-12 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-purple-200 transform transition-all active:scale-[0.98] hover:shadow-2xl hover:-translate-y-0.5">
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