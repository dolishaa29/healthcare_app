import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { CheckCircle2, ChevronLeft, Loader2, Send, FileText, CalendarCheck, Search, Building2 } from "lucide-react";

const Appointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_API_URL + "/viewdoctors");
        if (response.status === 200) setDoctors(response.data.doctors);
      } catch (err) {
        setError("Failed to load doctors. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    const filename = imagePath.split(/[\\/]/).pop();
    return `${import.meta.env.VITE_API_URL}/images/${filename}`;
  };

  const filtered = doctors.filter(
    (d) =>
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  const sendAppointmentRequest = async () => {
    if (!description.trim()) {
      setError("Please describe your reason for visit");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/appointrequest",
        { doctorid: selectedDoctor._id, description },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setSuccess(true);
        setDescription("");
      } else {
        setError(res.data.message || "Request failed");
      }
    } catch {
      setError("Error sending appointment request");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="h-full overflow-y-auto bg-[#FDFBFF] flex items-center justify-center p-10">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100">
            <CheckCircle2 className="text-green-500" size={44} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-3">Request Sent!</h2>
          <p className="text-slate-400 text-sm mb-1">Your appointment request has been sent to</p>
          <p className="text-indigo-600 font-extrabold text-xl mb-3">Dr. {selectedDoctor?.name}</p>
          <p className="text-slate-400 text-xs mb-10 leading-relaxed">
            You'll be notified once the doctor confirms your appointment. You can track status in{" "}
            <span className="font-bold text-slate-500">My Appointments</span>.
          </p>
          <button
            onClick={() => {
              setSuccess(false);
              setSelectedDoctor(null);
              setStep(1);
              setSearch("");
            }}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:opacity-90 transition-all active:scale-[0.98]"
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-[#FDFBFF] px-5 py-8 md:px-8 lg:px-10">

      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-1">Healthcare</p>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter leading-tight">
            Book an{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
              Appointment
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-5 py-3 shadow-sm self-start sm:self-center shrink-0">
          <StepDot active={step >= 1} done={step > 1} label="1" text="Choose Doctor" />
          <div className={`w-8 md:w-12 h-0.5 rounded-full transition-all ${step > 1 ? "bg-indigo-500" : "bg-slate-200"}`} />
          <StepDot active={step >= 2} done={false} label="2" text="Your Reason" />
        </div>
      </div>

      {step === 1 ? (
        <>
          <div className="relative mb-7 max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all shadow-sm"
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <SkeletonCard key={n} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-slate-300">
              <CalendarCheck size={52} strokeWidth={1} />
              <p className="mt-4 font-bold text-slate-400 text-base">
                {search ? "No doctors match your search" : "No doctors available"}
              </p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="mt-3 text-xs text-indigo-500 font-bold hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((doc) => (
                <DoctorSelectCard
                  key={doc._id}
                  doctor={doc}
                  imageUrl={getImageUrl(doc.image)}
                  onSelect={() => {
                    setSelectedDoctor(doc);
                    setStep(2);
                    setError("");
                  }}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="max-w-2xl mx-auto lg:mx-0">
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-indigo-600 transition-colors mb-7"
          >
            <ChevronLeft size={14} strokeWidth={2.5} />
            Back to Doctors
          </button>

          <div className="bg-white border border-slate-100 rounded-3xl p-5 flex items-center gap-4 mb-5 shadow-sm">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
              {getImageUrl(selectedDoctor?.image) ? (
                <img
                  src={getImageUrl(selectedDoctor.image)}
                  alt={selectedDoctor.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <span className="text-indigo-400 font-black text-2xl">
                    {selectedDoctor?.name?.[0]}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-indigo-500 tracking-widest uppercase">
                {selectedDoctor?.specialization || "Specialist"}
              </p>
              <p className="font-extrabold text-slate-900 tracking-tight text-base">Dr. {selectedDoctor?.name}</p>
              {selectedDoctor?.hospitalName && (
                <p className="text-xs text-slate-400 truncate flex items-center gap-1 mt-0.5">
                  <Building2 size={10} />
                  {selectedDoctor.hospitalName}
                  {selectedDoctor.clinicAddress ? ` • ${selectedDoctor.clinicAddress}` : ""}
                </p>
              )}
            </div>
            {selectedDoctor?.experienceYears && (
              <div className="bg-indigo-50 px-3 py-2 rounded-xl shrink-0 text-center">
                <p className="text-[10px] font-black text-indigo-600">
                  {selectedDoctor.experienceYears}Y+
                </p>
                <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider">Exp</p>
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
              Reason for Visit
            </label>
            <div className="relative">
              <textarea
                placeholder="Describe your symptoms or health concern in detail. The more specific you are, the better the doctor can prepare for your visit."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (error) setError("");
                }}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all resize-none h-40"
              />
              <FileText size={16} className="absolute right-4 top-4 text-slate-200 pointer-events-none" />
            </div>
            <p className="text-[10px] text-slate-300 mt-2 ml-1 text-right">{description.length} characters</p>
          </div>

          {error && (
            <p className="text-red-500 text-xs font-bold mt-3 ml-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
              {error}
            </p>
          )}

          <button
            onClick={sendAppointmentRequest}
            disabled={submitting || !description.trim()}
            className="w-full mt-5 py-4 bg-gradient-to-r from-purple-600 to-indigo-500 hover:opacity-90 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send size={16} />
                Send Appointment Request
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

const StepDot = ({ active, done, label, text }) => (
  <div className="flex items-center gap-2">
    <div
      className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all
        ${active ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "bg-slate-100 text-slate-400"}`}
    >
      {done ? "✓" : label}
    </div>
    <span className={`text-[11px] font-bold hidden sm:block ${active ? "text-slate-700" : "text-slate-300"}`}>
      {text}
    </span>
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden animate-pulse">
    <div className="h-52 bg-slate-100" />
    <div className="p-5 space-y-3">
      <div className="h-2.5 bg-slate-100 rounded-full w-1/3" />
      <div className="h-4 bg-slate-100 rounded-full w-2/3" />
      <div className="h-2.5 bg-slate-100 rounded-full w-full" />
      <div className="h-11 bg-slate-100 rounded-2xl mt-4" />
    </div>
  </div>
);

const DoctorSelectCard = ({ doctor, imageUrl, onSelect }) => (
  <div
    onClick={onSelect}
    className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-50 hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
  >
    {/* Image */}
    <div className="relative h-52 overflow-hidden shrink-0">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={doctor.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center">
          <span className="text-7xl font-black text-indigo-200">{doctor.name?.[0]}</span>
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />

      {doctor.experienceYears && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-xl shadow-sm">
          <p className="text-[10px] font-black text-slate-800 leading-none">{doctor.experienceYears}Y+</p>
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Exp</p>
        </div>
      )}
    </div>

    {/* Info */}
    <div className="p-5 flex flex-col flex-1">
      <span className="text-[10px] font-bold text-indigo-500 tracking-[0.18em] uppercase mb-1">
        {doctor.specialization || "General"}
      </span>
      <h3 className="font-extrabold text-slate-900 tracking-tight text-base leading-tight mb-1">
        Dr. {doctor.name}
      </h3>

      <div className="mt-auto pt-3">
        <button className="w-full py-3.5 rounded-2xl bg-linear-to-r from-purple-600 to-indigo-500 text-white font-bold text-[11px] uppercase tracking-widest group-hover:shadow-lg group-hover:shadow-indigo-200 transition-all">
          Select Doctor
        </button>
      </div>
    </div>
  </div>
);

export default Appointment;
