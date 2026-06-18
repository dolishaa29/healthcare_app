import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  CheckCircle2, ChevronLeft, Loader2, Send, FileText,
  CalendarCheck, Search, Building2, Stethoscope, Star, Clock
} from "lucide-react";

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
          <div className="relative mx-auto mb-8 w-32 h-32">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30" />
            <div className="relative w-32 h-32 bg-linear-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-200">
              <CheckCircle2 className="text-white" size={52} strokeWidth={1.5} />
            </div>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Appointment Requested!</h2>
          <p className="text-slate-400 text-sm mb-1">Your request has been sent to</p>
          <p className="text-indigo-600 font-extrabold text-xl mb-6">Dr. {selectedDoctor?.name}</p>

          <div className="bg-white border border-slate-100 rounded-2xl p-4 mb-8 text-left shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                <Clock size={16} className="text-indigo-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">What happens next?</p>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  The doctor will review and confirm your appointment. Track status in <span className="font-semibold text-slate-500">My Appointments</span>.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => { setSuccess(false); setSelectedDoctor(null); setStep(1); setSearch(""); }}
            className="px-8 py-4 bg-linear-to-r from-purple-600 to-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:opacity-90 transition-all active:scale-[0.98]"
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-[#FDFBFF]">
      {/* Header */}
      <div className="px-6 pt-8 pb-6 md:px-10 border-b border-slate-100 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-1">Healthcare</p>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">
              Book an{" "}
              <span className="bg-linear-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
                Appointment
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {step === 1 ? "Choose a doctor to get started" : "Tell the doctor why you're visiting"}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-3 shrink-0">
            <StepPill number={1} label="Choose Doctor" active={step >= 1} done={step > 1} />
            <div className={`w-10 h-0.5 rounded-full transition-all duration-500 ${step > 1 ? "bg-indigo-400" : "bg-slate-200"}`} />
            <StepPill number={2} label="Your Reason" active={step >= 2} done={false} />
          </div>
        </div>
      </div>

      <div className="px-6 py-8 md:px-10">
        {step === 1 ? (
          <>
            {/* Search */}
            <div className="relative mb-6 max-w-md">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name or specialization..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all shadow-sm"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 text-lg leading-none">×</button>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((n) => <SkeletonCard key={n} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                  <CalendarCheck size={28} className="text-slate-300" strokeWidth={1.5} />
                </div>
                <p className="font-bold text-slate-500 text-base">
                  {search ? "No doctors match your search" : "No doctors available"}
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  {search ? "Try a different name or specialization" : "Check back later"}
                </p>
                {search && (
                  <button onClick={() => setSearch("")} className="mt-4 text-xs text-indigo-500 font-bold hover:underline">
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-400 font-semibold mb-4">
                  {filtered.length} doctor{filtered.length !== 1 ? "s" : ""} available
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filtered.map((doc) => (
                    <DoctorSelectCard
                      key={doc._id}
                      doctor={doc}
                      imageUrl={getImageUrl(doc.image)}
                      onSelect={() => { setSelectedDoctor(doc); setStep(2); setError(""); }}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="max-w-3xl">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-indigo-600 transition-colors mb-6"
            >
              <ChevronLeft size={14} strokeWidth={2.5} />
              Back to Doctors
            </button>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
              {/* Doctor Info Card */}
              <div className="md:col-span-2">
                <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm sticky top-0">
                  <div className="h-40 relative">
                    {getImageUrl(selectedDoctor?.image) ? (
                      <img src={getImageUrl(selectedDoctor.image)} alt={selectedDoctor.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-indigo-100 to-purple-200 flex items-center justify-center">
                        <span className="text-6xl font-black text-indigo-300">{selectedDoctor?.name?.[0]}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                    {selectedDoctor?.experienceYears && (
                      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1.5 rounded-xl text-center shadow">
                        <p className="text-[11px] font-black text-slate-800 leading-none">{selectedDoctor.experienceYears}Y+</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Exp</p>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <p className="text-[10px] font-bold text-indigo-500 tracking-widest uppercase mb-1">
                      {selectedDoctor?.specialization || "Specialist"}
                    </p>
                    <p className="font-extrabold text-slate-900 text-lg tracking-tight">Dr. {selectedDoctor?.name}</p>
                    {selectedDoctor?.hospitalName && (
                      <div className="flex items-center gap-1.5 mt-2 text-slate-400">
                        <Building2 size={12} />
                        <p className="text-xs truncate">{selectedDoctor.hospitalName}</p>
                      </div>
                    )}
                    {selectedDoctor?.clinicAddress && (
                      <p className="text-xs text-slate-300 mt-1 pl-4 truncate">{selectedDoctor.clinicAddress}</p>
                    )}

                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
                      <Stethoscope size={13} className="text-indigo-400" />
                      <span className="text-[11px] text-slate-400 font-medium">Ready to consult</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="md:col-span-3 flex flex-col gap-4">
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 bg-indigo-50 rounded-xl flex items-center justify-center">
                      <FileText size={13} className="text-indigo-500" />
                    </div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                      Reason for Visit
                    </label>
                  </div>

                  <textarea
                    placeholder="Describe your symptoms or health concern in detail. The more specific you are, the better the doctor can prepare for your visit..."
                    value={description}
                    onChange={(e) => { setDescription(e.target.value); if (error) setError(""); }}
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all resize-none h-44 leading-relaxed"
                  />

                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[10px] text-slate-300">
                      Be as specific as possible
                    </p>
                    <p className={`text-[10px] font-semibold ${description.length > 20 ? "text-indigo-400" : "text-slate-300"}`}>
                      {description.length} chars
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                    <p className="text-red-500 text-xs font-semibold">{error}</p>
                  </div>
                )}

                <button
                  onClick={sendAppointmentRequest}
                  disabled={submitting || !description.trim()}
                  className="w-full py-4 bg-linear-to-r from-purple-600 to-indigo-500 hover:opacity-90 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 text-sm"
                >
                  {submitting ? (
                    <><Loader2 size={17} className="animate-spin" /> Sending Request...</>
                  ) : (
                    <><Send size={15} /> Send Appointment Request</>
                  )}
                </button>

                <p className="text-center text-[11px] text-slate-300">
                  Your request will be reviewed by Dr. {selectedDoctor?.name}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StepPill = ({ number, label, active, done }) => (
  <div className="flex items-center gap-2">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 shadow-sm
      ${active ? "bg-linear-to-br from-purple-600 to-indigo-500 text-white shadow-indigo-200" : "bg-slate-100 text-slate-400"}`}>
      {done ? "✓" : number}
    </div>
    <span className={`text-xs font-bold hidden sm:block transition-colors ${active ? "text-slate-700" : "text-slate-300"}`}>
      {label}
    </span>
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden animate-pulse">
    <div className="h-48 bg-slate-100" />
    <div className="p-5 space-y-3">
      <div className="h-2 bg-slate-100 rounded-full w-1/3" />
      <div className="h-4 bg-slate-100 rounded-full w-2/3" />
      <div className="h-2.5 bg-slate-100 rounded-full w-full" />
      <div className="h-2.5 bg-slate-100 rounded-full w-4/5" />
      <div className="h-11 bg-slate-100 rounded-2xl mt-2" />
    </div>
  </div>
);

const DoctorSelectCard = ({ doctor, imageUrl, onSelect }) => (
  <div
    onClick={onSelect}
    className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-50 hover:border-indigo-100 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
  >
    {/* Image */}
    <div className="relative h-48 overflow-hidden shrink-0">
      {imageUrl ? (
        <img src={imageUrl} alt={doctor.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      ) : (
        <div className="w-full h-full bg-linear-to-br from-indigo-50 to-purple-100 flex items-center justify-center">
          <span className="text-7xl font-black text-indigo-200">{doctor.name?.[0]}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />

      {doctor.experienceYears && (
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1.5 rounded-xl shadow-sm">
          <p className="text-[10px] font-black text-slate-800 leading-none">{doctor.experienceYears}Y+</p>
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Exp</p>
        </div>
      )}

      <div className="absolute bottom-3 left-3">
        <span className="text-[10px] font-bold text-white/90 bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-lg uppercase tracking-wider">
          {doctor.specialization || "General"}
        </span>
      </div>
    </div>

    {/* Info */}
    <div className="p-5 flex flex-col flex-1">
      <h3 className="font-extrabold text-slate-900 tracking-tight text-base leading-tight">
        Dr. {doctor.name}
      </h3>
      {doctor.hospitalName && (
        <div className="flex items-center gap-1.5 mt-1.5 text-slate-400">
          <Building2 size={11} />
          <span className="text-[11px] truncate">{doctor.hospitalName}</span>
        </div>
      )}

      <div className="mt-auto pt-4">
        <button className="w-full py-3 rounded-2xl bg-linear-to-r from-purple-600 to-indigo-500 text-white font-bold text-[11px] uppercase tracking-widest group-hover:shadow-lg group-hover:shadow-indigo-100 transition-all duration-300">
          Select Doctor
        </button>
      </div>
    </div>
  </div>
);

export default Appointment;
