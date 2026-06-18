import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Camera, Stethoscope, Building2, GraduationCap, FileText, Lock, CheckCircle2 } from "lucide-react";

const inputClass =
  "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed";
const labelClass =
  "block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5";

const Field = ({ label, children }) => (
  <div>
    <label className={labelClass}>{label}</label>
    {children}
  </div>
);

const SectionCard = ({ icon, title, children }) => (
  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
    <div className="flex items-center gap-2.5 mb-5">
      <div className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600">{icon}</div>
      <h3 className="text-sm font-bold text-slate-800">{title}</h3>
    </div>
    {children}
  </div>
);

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState({
    name: "", email: "", contact: "", gender: "",
    experienceYears: "", hospitalName: "", HospitalAddress: "",
    bio: "", specialization: "", title: "", institution: "",
    year: "", image: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const fetchDoctorProfile = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/doctorprofile`, {
        headers: { Authorization: `Bearer ${Cookies.get("emstoken")}` },
        withCredentials: true,
      });
      if (data?.doctors) {
        setDoctor(data.doctors);
        if (data.doctors.image) setImagePreview(data.doctors.image);
      }
    } catch {
      setError("Failed to fetch profile details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDoctorProfile(); }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
    } else {
      setDoctor((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);
    const formData = new FormData();
    ["name", "email", "contact", "gender", "specialization", "experienceYears",
      "hospitalName", "HospitalAddress", "bio", "title", "institution", "year"
    ].forEach((k) => formData.append(k, doctor[k] || ""));
    if (imageFile) formData.append("image", imageFile);
    try {
      await axios.put(`${API_BASE_URL}/updatedoctor`, formData, {
        headers: {
          Authorization: `Bearer ${Cookies.get("emstoken")}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      setSuccess(true);
      setImageFile(null);
      fetchDoctorProfile();
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="h-full bg-[#FDFBFF] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="h-full overflow-y-auto bg-[#FDFBFF] px-6 py-10 md:px-10">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <p className="text-[10px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-1">Doctor Portal</p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            Your{" "}
            <span className="bg-linear-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
              Profile
            </span>
          </h1>
        </div>
        <button
          type="button"
          onClick={() => navigate("/changepassword")}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-2xl transition-all"
        >
          <Lock size={14} />
          Change Password
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
        {/* Photo + Name card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-100">
              {imagePreview ? (
                <img src={imagePreview} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-indigo-100 to-purple-100">
                  <span className="text-3xl font-black text-indigo-300">{doctor.name?.[0] || "D"}</span>
                </div>
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center cursor-pointer shadow-lg hover:bg-indigo-700 transition-colors">
              <Camera size={14} className="text-white" />
              <input type="file" accept="image/*" name="image" onChange={handleChange} className="hidden" />
            </label>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Dr. {doctor.name}</h2>
            <p className="text-sm text-slate-400 mt-0.5">{doctor.email}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
              {doctor.specialization && (
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-wider">
                  {doctor.specialization}
                </span>
              )}
              {doctor.experienceYears && (
                <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-xl text-[10px] font-black uppercase tracking-wider">
                  {doctor.experienceYears}Y exp
                </span>
              )}
              {doctor.gender && (
                <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-wider">
                  {doctor.gender}
                </span>
              )}
            </div>
          </div>
        </div>

        <SectionCard icon={<Stethoscope size={15} />} title="Basic Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Full Name">
              <input name="name" value={doctor.name || ""} onChange={handleChange} className={inputClass} placeholder="Dr. Full Name" />
            </Field>
            <Field label="Email Address">
              <input name="email" value={doctor.email || ""} onChange={handleChange} className={inputClass} disabled />
            </Field>
            <Field label="Contact No.">
              <input name="contact" value={doctor.contact || ""} onChange={handleChange} className={inputClass} placeholder="+1 234 567 8900" />
            </Field>
            <Field label="Gender">
              <select name="gender" value={doctor.gender || ""} onChange={handleChange} className={inputClass}>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </Field>
            <Field label="Specialization">
              <input name="specialization" value={doctor.specialization || ""} onChange={handleChange} className={inputClass} placeholder="e.g. Cardiologist" />
            </Field>
            <Field label="Years of Experience">
              <input name="experienceYears" value={doctor.experienceYears || ""} onChange={handleChange} className={inputClass} placeholder="e.g. 10" />
            </Field>
          </div>
        </SectionCard>

        <SectionCard icon={<Building2 size={15} />} title="Hospital / Clinic">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Hospital Name">
              <input name="hospitalName" value={doctor.hospitalName || ""} onChange={handleChange} className={inputClass} placeholder="Hospital name" />
            </Field>
            <div className="md:col-span-2">
              <Field label="Hospital Address">
                <input name="HospitalAddress" value={doctor.HospitalAddress || ""} onChange={handleChange} className={inputClass} placeholder="Full hospital address" />
              </Field>
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={<GraduationCap size={15} />} title="Academic Degree">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Degree (e.g. MBBS)">
              <input name="title" value={doctor.title || ""} onChange={handleChange} className={inputClass} placeholder="Degree title" />
            </Field>
            <Field label="Institution">
              <input name="institution" value={doctor.institution || ""} onChange={handleChange} className={inputClass} placeholder="University / College" />
            </Field>
            <Field label="Year">
              <input name="year" value={doctor.year || ""} onChange={handleChange} className={inputClass} placeholder="Graduation year" />
            </Field>
          </div>
        </SectionCard>

        <SectionCard icon={<FileText size={15} />} title="Professional Bio">
          <textarea
            name="bio"
            value={doctor.bio || ""}
            onChange={handleChange}
            className={`${inputClass} resize-none h-28`}
            placeholder="Tell patients about your medical journey and expertise..."
          />
        </SectionCard>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold">{error}</div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 text-green-600 text-sm font-bold">
            <CheckCircle2 size={18} />
            Profile updated successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="px-10 py-4 bg-linear-to-r from-purple-600 to-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default DoctorProfile;
