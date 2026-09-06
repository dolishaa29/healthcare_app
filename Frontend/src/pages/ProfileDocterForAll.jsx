import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Stethoscope, GraduationCap, MessageSquare } from 'lucide-react';

const labelClass = "block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5";
const valueClass = "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-700 font-medium";

const Field = ({ label, value }) => (
  <div>
    <label className={labelClass}>{label}</label>
    <div className={valueClass}>{value || '—'}</div>
  </div>
);

const SectionCard = ({ icon, title, children, accent }) => (
  <div className={`bg-white border rounded-3xl p-6 shadow-sm ${accent === 'amber' ? 'border-amber-100' : 'border-slate-100'}`}>
    <div className="flex items-center gap-2.5 mb-5">
      <div className={`p-1.5 rounded-xl ${accent === 'amber' ? 'bg-amber-50 text-amber-500' : 'bg-indigo-50 text-indigo-600'}`}>
        {icon}
      </div>
      <h3 className={`text-sm font-bold ${accent === 'amber' ? 'text-amber-600' : 'text-slate-800'}`}>{title}</h3>
    </div>
    {children}
  </div>
);

const ProfileDocterForAll = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [profileRes, ratingsRes] = await Promise.allSettled([
          axios.get(`${API_BASE_URL}/doctorprofileview/${id}`),
          axios.get(`${API_BASE_URL}/viewrating/${id}`),
        ]);

        if (profileRes.status === 'fulfilled') {
          const data = profileRes.value.data.doctor;
          setDoctor(data);
          if (data?.image) {
            const filename = data.image.split(/[\\/]/).pop();
            setImagePreview(`${API_BASE_URL}/images/${filename}`);
          }
        } else {
          setError(profileRes.reason?.response?.data?.message || 'Failed to load profile.');
        }

        if (ratingsRes.status === 'fulfilled' && ratingsRes.value.data.status) {
          const data = ratingsRes.value.data.data || [];
          setRatings(data);
          if (data.length > 0) {
            const sum = data.reduce((acc, r) => acc + r.rating, 0);
            setAverageRating((sum / data.length).toFixed(1));
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500 font-bold">{error}</p>
          <button onClick={() => navigate(-1)} className="px-5 py-2 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] px-6 py-10 md:px-10">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <p className="text-[10px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-1">Physician</p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            Doctor{' '}
            <span className="bg-linear-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
              Profile
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/rating/${id}`)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-2xl transition-all"
          >
            <Star size={14} className="fill-amber-400 text-amber-400" />
            Rate Doctor
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 rounded-2xl transition-all"
          >
            <ArrowLeft size={14} />
            Back
          </button>
        </div>
      </div>

      <div className="space-y-5 max-w-3xl">

        {/* Profile summary card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-100 shrink-0">
            {imagePreview ? (
              <img src={imagePreview} className="w-full h-full object-cover" alt="Doctor" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-indigo-100 to-violet-100">
                <span className="text-3xl font-black text-indigo-300">{doctor?.name?.[0] || '?'}</span>
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Dr. {doctor?.name}</h2>
            <p className="text-sm text-slate-400 mt-0.5">{doctor?.email}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
              {doctor?.specialization && (
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-wider">
                  {doctor.specialization}
                </span>
              )}
              {doctor?.gender && (
                <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-wider">
                  {doctor.gender}
                </span>
              )}
              {doctor?.experienceYears && (
                <span className="px-3 py-1 bg-violet-50 text-violet-600 rounded-xl text-[10px] font-black uppercase tracking-wider">
                  {doctor.experienceYears}Y Exp
                </span>
              )}
              {averageRating > 0 && (
                <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <Star size={10} className="fill-amber-400 text-amber-400" />
                  {averageRating} / 5
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {doctor?.bio && (
          <SectionCard icon={<Stethoscope size={15} />} title="About">
            <p className="text-sm text-slate-600 leading-relaxed italic border-l-4 border-indigo-100 pl-4">
              "{doctor.bio}"
            </p>
          </SectionCard>
        )}

        {/* Professional Info */}
        <SectionCard icon={<Stethoscope size={15} />} title="Professional Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Full Name" value={`Dr. ${doctor?.name}`} />
            <Field label="Email" value={doctor?.email} />
            <Field label="Phone" value={doctor?.contact} />
            <Field label="Gender" value={doctor?.gender} />
            <Field label="Specialization" value={doctor?.specialization} />
            <Field label="Experience" value={doctor?.experienceYears ? `${doctor.experienceYears} Years` : null} />
            <div className="md:col-span-2">
              <Field
                label="Practice Address"
                value={doctor?.HospitalAddress || doctor?.clinicAddress}
              />
            </div>
          </div>
        </SectionCard>

        {/* Academic */}
        <SectionCard icon={<GraduationCap size={15} />} title="Academic Background">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Degree / Title" value={doctor?.title} />
            <Field label="Institution" value={doctor?.institution} />
            <Field label="Graduation Year" value={doctor?.year} />
            <Field label="Hospital" value={doctor?.hospitalName} />
          </div>
        </SectionCard>

        {/* Reviews */}
        {ratings.length > 0 && (
          <SectionCard icon={<MessageSquare size={15} />} title="Patient Reviews" accent="amber">
            <div className="flex items-center gap-4 mb-5 p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <div className="text-center">
                <p className="text-4xl font-black text-amber-600">{averageRating}</p>
                <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">out of 5</p>
              </div>
              <div className="h-10 w-px bg-amber-200" />
              <div>
                <p className="text-sm font-bold text-slate-700">{ratings.length} {ratings.length === 1 ? 'review' : 'reviews'}</p>
                <p className="text-xs text-slate-400 mt-0.5">Based on patient feedback</p>
              </div>
            </div>

            <div className="space-y-3">
              {ratings.map((r, i) => (
                <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                    <span className="text-sm font-black text-amber-600">{r.rating}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.rating} / 5</span>
                    </div>
                    {r.description && (
                      <p className="text-sm text-slate-600 leading-relaxed">"{r.description}"</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}
      </div>
    </div>
  );
};

export default ProfileDocterForAll;
