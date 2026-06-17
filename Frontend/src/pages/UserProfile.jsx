import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Camera, User, Users, AlertTriangle, CheckCircle2, Lock } from "lucide-react";

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

const SectionCard = ({ icon, title, children, accent }) => (
  <div
    className={`bg-white border rounded-3xl p-6 shadow-sm ${
      accent === "red" ? "border-red-100" : "border-slate-100"
    }`}
  >
    <div className="flex items-center gap-2.5 mb-5">
      <div
        className={`p-1.5 rounded-xl ${
          accent === "red"
            ? "bg-red-50 text-red-500"
            : "bg-indigo-50 text-indigo-600"
        }`}
      >
        {icon}
      </div>
      <h3
        className={`text-sm font-bold ${
          accent === "red" ? "text-red-600" : "text-slate-800"
        }`}
      >
        {title}
      </h3>
    </div>
    {children}
  </div>
);

const UserProfile = () => {
  const [user, setUser] = useState({
    name: "", email: "", contact: "", address: "", gender: "", dob: "",
    fatherName: "", motherName: "", maritalStatus: "", nationality: "",
    bloodGroup: "", emergencyContactName: "", emergencyContactNumber: "",
    emergencyRelation: "", image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/userprofile`, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        withCredentials: true,
      });
      const userData = response.data.user;
      setUser(userData);
      if (userData.image) setImagePreview(userData.image);
    } catch {
      setError("Failed to fetch profile details.");
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
    setSaving(true);
    setError("");
    setSuccess(false);
    const formData = new FormData();
    [
      "name", "email", "contact", "address", "gender", "dob",
      "fatherName", "motherName", "maritalStatus", "nationality",
      "bloodGroup", "emergencyContactName", "emergencyContactNumber", "emergencyRelation",
    ].forEach((k) => formData.append(k, user[k] || ""));
    if (imageFile) formData.append("image", imageFile);
    try {
      await axios.put(`${API_BASE_URL}/updateuser`, formData, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      setSuccess(true);
      setImageFile(null);
      fetchUserProfile();
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-[#FDFBFF] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-[#FDFBFF] px-6 py-10 md:px-10">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <p className="text-[10px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-1">
            Account
          </p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            Your{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
              Profile
            </span>
          </h1>
        </div>
        <button
          type="button"
          onClick={() => navigate("/changepassworduser")}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-2xl transition-all"
        >
          <Lock size={14} />
          Change Password
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-100">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  className="w-full h-full object-cover"
                  alt="Profile"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                  <span className="text-3xl font-black text-indigo-300">
                    {user.name?.[0] || "?"}
                  </span>
                </div>
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center cursor-pointer shadow-lg hover:bg-indigo-700 transition-colors">
              <Camera size={14} className="text-white" />
              <input
                type="file"
                accept="image/*"
                name="image"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {user.name }
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">{user.email}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
              {user.bloodGroup && (
                <span className="px-3 py-1 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-wider">
                  {user.bloodGroup}
                </span>
              )}
              {user.gender && (
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-wider">
                  {user.gender}
                </span>
              )}
              {user.nationality && (
                <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-wider">
                  {user.nationality}
                </span>
              )}
            </div>
          </div>
        </div>

        <SectionCard icon={<User size={15} />} title="Basic Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Full Name">
              <input
                name="name"
                value={user.name || ""}
                onChange={handleChange}
                className={inputClass}
                placeholder="Your full name"
              />
            </Field>
            <Field label="Email">
              <input
                name="email"
                value={user.email || ""}
                onChange={handleChange}
                className={inputClass}
                disabled
              />
            </Field>
            <Field label="Contact No.">
              <input
                name="contact"
                value={user.contact || ""}
                onChange={handleChange}
                className={inputClass}
                placeholder="+1 234 567 8900"
              />
            </Field>
            <Field label="Gender">
              <select
                name="gender"
                value={user.gender || ""}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </Field>
            <Field label="Date of Birth">
              <input
                type="date"
                name="dob"
                value={user.dob ? user.dob.split("T")[0] : ""}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>
            <Field label="Blood Group">
              <input
                name="bloodGroup"
                value={user.bloodGroup || ""}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. A+"
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Address">
                <textarea
                  name="address"
                  value={user.address || ""}
                  onChange={handleChange}
                  className={`${inputClass} resize-none h-20`}
                  placeholder="Your full address"
                />
              </Field>
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={<Users size={15} />} title="Family & Personal">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Father's Name">
              <input
                name="fatherName"
                value={user.fatherName || ""}
                onChange={handleChange}
                className={inputClass}
                placeholder="Father's full name"
              />
            </Field>
            <Field label="Mother's Name">
              <input
                name="motherName"
                value={user.motherName || ""}
                onChange={handleChange}
                className={inputClass}
                placeholder="Mother's full name"
              />
            </Field>
            <Field label="Marital Status">
              <select
                name="maritalStatus"
                value={user.maritalStatus || ""}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="other">Other</option>
              </select>
            </Field>
            <Field label="Nationality">
              <input
                name="nationality"
                value={user.nationality || ""}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. American"
              />
            </Field>
          </div>
        </SectionCard>


        <SectionCard
          icon={<AlertTriangle size={15} />}
          title="Emergency Contact"
          accent="red"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Name">
              <input
                name="emergencyContactName"
                value={user.emergencyContactName || ""}
                onChange={handleChange}
                className={inputClass}
                placeholder="Contact name"
              />
            </Field>
            <Field label="Relation">
              <input
                name="emergencyRelation"
                value={user.emergencyRelation || ""}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. Spouse"
              />
            </Field>
            <Field label="Phone">
              <input
                name="emergencyContactNumber"
                value={user.emergencyContactNumber || ""}
                onChange={handleChange}
                className={inputClass}
                placeholder="Phone number"
              />
            </Field>
          </div>
        </SectionCard>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold">
            {error}
          </div>
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
          className="px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
