import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    gender: "",
    dob: "",
    fatherName: "",
    motherName: "",
    maritalStatus: "",
    nationality: "",
    bloodGroup: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    emergencyRelation: "",
    image: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/userprofile`, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        withCredentials: true,
      });

      const userData = response.data.user;
      setUser(userData);
      
      if (userData.image) {
        const filename = userData.image.split(/[\\/]/).pop();
        setImagePreview(`${API_BASE_URL}/images/${filename}`);
      }
    } catch (err) {
      setError("Failed to fetch profile details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      if (file) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      setUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("name", user.name || "");
    formData.append("email", user.email || "");
    formData.append("contact", user.contact || "");
    formData.append("address", user.address || "");
    formData.append("gender", user.gender || "");
    formData.append("dob", user.dob || "");
    formData.append("fatherName", user.fatherName || "");
    formData.append("motherName", user.motherName || "");
    formData.append("maritalStatus", user.maritalStatus || "");
    formData.append("nationality", user.nationality || "");
    formData.append("bloodGroup", user.bloodGroup || "");
    formData.append("emergencyContactName", user.emergencyContactName || "");
    formData.append("emergencyContactNumber", user.emergencyContactNumber || "");
    formData.append("emergencyRelation", user.emergencyRelation || "");

    if (imageFile) {
      formData.append("image", imageFile);
    } else {
      formData.append("image", user.image );
    }

    try {
      await axios.put(`${API_BASE_URL}/updateuser`, formData, {
        headers: { 
          Authorization: `Bearer ${Cookies.get("token")}`,
          'Content-Type': 'multipart/form-data' 
        },
        withCredentials: true,
      });
      alert("Profile Updated Successfully!");
      setImageFile(null);
      fetchUserProfile(); 
    } catch (err) {
      setError("Failed to update profile.");
      console.error(err);
    }
  };


  const inputStyle = "w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all shadow-sm";
  const labelStyle = "block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1";

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] bg-[radial-gradient(ellipse_at_top,_#eff6ff,_#f8fafc)] font-sans py-12 px-4 relative overflow-x-hidden">
      
      <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-2xl rounded-[2.5rem] border border-white shadow-[0_30px_60px_-15px_rgba(30,64,175,0.08)] p-8 md:p-12">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              User <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Profile</span>
            </h1>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mt-1">Manage your account details</p>
          </div>
          <button type="button" onClick={() => navigate("/changepassworduser")} className="px-5 py-2 text-sm font-bold text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 transition-all">
            Change Password
          </button>
        </div>

        {loading && !user.name ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div></div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <section className="text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-slate-100 shadow-inner">
                  {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" alt="Profile" /> : <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-[10px]">NO PHOTO</div>}
                </div>
                <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                  <input type="file" accept="image/*" name="image" onChange={handleChange} className="hidden" />
                  UPLOAD PHOTO
                </label>
              </div>
            </section>


            <section>
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><label className={labelStyle}>Full Name</label><input name="name" value={user.name || ""} onChange={handleChange} className={inputStyle} /></div>
                <div><label className={labelStyle}>Email (Primary)</label><input name="email" value={user.email || ""} onChange={handleChange} className={inputStyle} disabled /></div>
                <div><label className={labelStyle}>Contact No.</label><input name="contact" value={user.contact || ""} onChange={handleChange} className={inputStyle} /></div>
                <div>
                  <label className={labelStyle}>Gender</label>
                  <select name="gender" value={user.gender || ""} onChange={handleChange} className={inputStyle}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div><label className={labelStyle}>Date of Birth</label><input type="date" name="dob" value={user.dob ? user.dob.split('T')[0] : ""} onChange={handleChange} className={inputStyle} /></div>
                <div><label className={labelStyle}>Blood Group</label><input name="bloodGroup" value={user.bloodGroup || ""} onChange={handleChange} className={inputStyle} /></div>
              </div>
            </section>


            <section>
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> Family & Personal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><label className={labelStyle}>Father's Name</label><input name="fatherName" value={user.fatherName || ""} onChange={handleChange} className={inputStyle} /></div>
                <div><label className={labelStyle}>Mother's Name</label><input name="motherName" value={user.motherName || ""} onChange={handleChange} className={inputStyle} /></div>
                <div>
                  <label className={labelStyle}>Marital Status</label>
                  <select name="maritalStatus" value={user.maritalStatus || ""} onChange={handleChange} className={inputStyle}>
                    <option value="">Select</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div><label className={labelStyle}>Nationality</label><input name="nationality" value={user.nationality || ""} onChange={handleChange} className={inputStyle} /></div>
                <div className="md:col-span-2"><label className={labelStyle}>Address</label><textarea name="address" value={user.address || ""} onChange={handleChange} className={`${inputStyle} min-h-[80px]`} /></div>
              </div>
            </section>


            <section className="p-6 bg-red-50/30 border border-red-100 rounded-2xl">
              <h3 className="text-sm font-bold text-red-600 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Emergency Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div><label className={labelStyle}>Name</label><input name="emergencyContactName" value={user.emergencyContactName || ""} onChange={handleChange} className={inputStyle} /></div>
                <div><label className={labelStyle}>Relation</label><input name="emergencyRelation" value={user.emergencyRelation || ""} onChange={handleChange} className={inputStyle} /></div>
                <div><label className={labelStyle}>Phone</label><input name="emergencyContactNumber" value={user.emergencyContactNumber || ""} onChange={handleChange} className={inputStyle} /></div>
              </div>
            </section>

            {error && <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold rounded-xl text-center uppercase tracking-widest">{error}</div>}

            <div className="pt-4">
              <button type="submit" className="w-full md:w-max px-12 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 transform transition-all active:scale-[0.98] hover:-translate-y-0.5">
                Save Profile Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfile;