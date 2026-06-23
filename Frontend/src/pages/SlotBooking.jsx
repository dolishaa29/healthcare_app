import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  CalendarDays, ChevronLeft, CheckCircle2, Loader2, Clock,
  Search, Building2, FileText, AlertCircle, Calendar
} from "lucide-react";

const API = import.meta.env.VITE_API_URL;

const SlotBooking = () => {
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [hasAppointmentToday, setHasAppointmentToday] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    axios
      .get(API + "/viewdoctors")
      .then((r) => setDoctors(r.data.doctors || []))
      .catch(() => setError("Failed to load doctors."))
      .finally(() => setLoadingDoctors(false));
  }, []);

  const filtered = doctors.filter(
    (d) =>
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    const filename = imagePath.split(/[\\/]/).pop();
    return `${API}/images/${filename}`;
  };

  const fetchSlots = async (doctorid, date) => {
    setLoadingSlots(true);
    setSlots([]);
    setSelectedSlot(null);
    setHasAppointmentToday(false);
    setError("");
    try {
      const res = await axios.get(API + "/available-slots", {
        params: { doctorid, date },
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        withCredentials: true,
      });
      if (res.data.success) {
        setSlots(res.data.slots || []);
        setHasAppointmentToday(res.data.hasAppointmentToday || false);
      }
    } catch {
      setError("Failed to fetch available slots.");
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    if (selectedDoctor && date) fetchSlots(selectedDoctor._id, date);
  };

  const handleBookSlot = async () => {
    if (!description.trim()) { setError("Please describe your reason for visit."); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await axios.post(
        API + "/book-slot",
        { doctorid: selectedDoctor._id, date: selectedDate, time: selectedSlot, description },
        { headers: { Authorization: `Bearer ${Cookies.get("token")}` }, withCredentials: true }
      );
      if (res.data.success) setSuccess(true);
      else setError(res.data.msg || "Booking failed.");
    } catch (err) {
      setError(err.response?.data?.msg || "Error booking slot.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setStep(1); setSelectedDoctor(null); setSelectedDate(""); setSlots([]);
    setSelectedSlot(null); setDescription(""); setSuccess(false); setError(""); setSearch("");
  };

  if (success) {
    return (
      <div className="h-full overflow-y-auto bg-[#FDFBFF] flex items-center justify-center p-10">
        <div className="text-center max-w-md">
          <div className="relative mx-auto mb-8 w-24 h-24">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl">
              <CheckCircle2 className="text-white" size={44} strokeWidth={1.5} />
            </div>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Appointment Booked!</h2>
          <p className="text-slate-400 text-sm mb-1">Your slot is confirmed with</p>
          <p className="text-indigo-600 font-extrabold text-xl mb-2">Dr. {selectedDoctor?.name}</p>
          <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mb-8">
            <Calendar size={14} />
            <span>{selectedDate}</span>
            <Clock size={14} className="ml-2" />
            <span>{formatTime(selectedSlot)}</span>
          </div>
          <button
            onClick={reset}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold rounded-2xl shadow-lg hover:opacity-90 transition-all"
          >
            Book Another Slot
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-[#FDFBFF] px-6 py-10 md:px-10">

      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-1">Direct Scheduling</p>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
          Book a{" "}
          <span className="bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
            Slot
          </span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {step === 1 ? "Choose a doctor" : step === 2 ? "Pick a date and time" : "Confirm your booking"}
        </p>
      </div>

      {/* Step 1: Select Doctor */}
      {step === 1 && (
        <>
          <div className="relative mb-6 max-w-md">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all shadow-sm"
            />
          </div>

          {loadingDoctors ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => <SkeletonCard key={n} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((doc) => (
                <DoctorCard
                  key={doc._id}
                  doctor={doc}
                  imageUrl={getImageUrl(doc.image)}
                  onSelect={() => { setSelectedDoctor(doc); setStep(2); setError(""); }}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Step 2: Pick Date + Slot */}
      {step === 2 && (
        <div className="max-w-2xl">
          <button
            onClick={() => { setStep(1); setSelectedDate(""); setSlots([]); setSelectedSlot(null); }}
            className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-indigo-600 transition-colors mb-6"
          >
            <ChevronLeft size={14} strokeWidth={2.5} /> Back to Doctors
          </button>

          {/* Selected Doctor */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 mb-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 text-xl font-black text-indigo-300 overflow-hidden">
              {getImageUrl(selectedDoctor?.image)
                ? <img src={getImageUrl(selectedDoctor.image)} className="w-full h-full object-cover" alt={selectedDoctor.name} />
                : selectedDoctor?.name?.[0]}
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-sm">Dr. {selectedDoctor?.name}</p>
              <p className="text-xs text-indigo-500 font-semibold">{selectedDoctor?.specialization}</p>
              {selectedDoctor?.hospitalName && (
                <div className="flex items-center gap-1 mt-0.5 text-slate-400">
                  <Building2 size={10} /><span className="text-[11px]">{selectedDoctor.hospitalName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Date Picker */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 mb-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays size={16} className="text-indigo-500" />
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Select Date</label>
            </div>
            <input
              type="date"
              min={today}
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all"
            />
          </div>

          {/* Slots */}
          {selectedDate && (
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={16} className="text-indigo-500" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Available Slots</span>
                <span className="ml-auto text-[10px] text-slate-400 font-semibold">9:00 AM – 5:00 PM · 30 min</span>
              </div>

              {loadingSlots ? (
                <div className="flex items-center justify-center py-12 gap-2 text-slate-400">
                  <Loader2 size={18} className="animate-spin" />
                  <span className="text-sm font-semibold">Loading slots...</span>
                </div>
              ) : hasAppointmentToday ? (
                <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                  <AlertCircle size={18} className="text-amber-500 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-amber-700">Already Booked</p>
                    <p className="text-xs text-amber-600 mt-0.5">You already have an appointment on this date.</p>
                  </div>
                </div>
              ) : slots.length === 0 ? (
                <p className="text-center text-slate-400 text-sm py-8">No slots available for this date.</p>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-4 text-[11px] font-semibold text-slate-400">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />Available</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block" />Booked</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />Selected</span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {slots.map((slot) => (
                      <button
                        key={slot.time}
                        disabled={!slot.available}
                        onClick={() => { setSelectedSlot(slot.time); setError(""); }}
                        className={`py-2.5 rounded-xl text-xs font-bold transition-all
                          ${!slot.available
                            ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                            : selectedSlot === slot.time
                            ? "bg-green-500 text-white shadow-md scale-105"
                            : "bg-indigo-50 text-indigo-600 hover:bg-indigo-500 hover:text-white hover:scale-105"}`}
                      >
                        {formatTime(slot.time)}
                      </button>
                    ))}
                  </div>

                  {selectedSlot && (
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <CheckCircle2 size={16} className="text-green-500" />
                        {formatTime(selectedSlot)}
                      </div>
                      <button
                        onClick={() => setStep(3)}
                        className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md hover:opacity-90 transition-all"
                      >
                        Continue →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <div className="max-w-xl">
          <button
            onClick={() => setStep(2)}
            className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-indigo-600 transition-colors mb-6"
          >
            <ChevronLeft size={14} strokeWidth={2.5} /> Back to Slots
          </button>

          {/* Summary */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 mb-4 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Booking Summary</p>
            <div className="space-y-2.5">
              <SummaryRow label="Doctor" value={`Dr. ${selectedDoctor?.name}`} />
              <SummaryRow label="Specialization" value={selectedDoctor?.specialization} />
              <SummaryRow label="Date" value={selectedDate} />
              <SummaryRow label="Time" value={formatTime(selectedSlot)} highlight />
            </div>
          </div>

          {/* Reason */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 mb-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={14} className="text-indigo-500" />
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Reason for Visit</label>
            </div>
            <textarea
              placeholder="Describe your symptoms or health concern..."
              value={description}
              onChange={(e) => { setDescription(e.target.value); if (error) setError(""); }}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all resize-none h-32 leading-relaxed"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl mb-4">
              <AlertCircle size={14} className="text-red-500 shrink-0" />
              <p className="text-red-500 text-xs font-semibold">{error}</p>
            </div>
          )}

          <button
            onClick={handleBookSlot}
            disabled={submitting || !description.trim()}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold rounded-2xl shadow-lg hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            {submitting
              ? <><Loader2 size={17} className="animate-spin" /> Booking...</>
              : <><CheckCircle2 size={16} /> Confirm Appointment</>}
          </button>
        </div>
      )}
    </div>
  );
};

const formatTime = (time) => {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
};

const SummaryRow = ({ label, value, highlight }) => (
  <div className="flex items-center justify-between">
    <span className="text-xs text-slate-400 font-semibold">{label}</span>
    <span className={`text-xs font-bold ${highlight ? "text-indigo-600" : "text-slate-700"}`}>{value}</span>
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden animate-pulse">
    <div className="h-44 bg-slate-100" />
    <div className="p-5 space-y-3">
      <div className="h-2 bg-slate-100 rounded-full w-1/3" />
      <div className="h-4 bg-slate-100 rounded-full w-2/3" />
      <div className="h-10 bg-slate-100 rounded-2xl mt-2" />
    </div>
  </div>
);

const DoctorCard = ({ doctor, imageUrl, onSelect }) => (
  <div
    onClick={onSelect}
    className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50 hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
  >
    <div className="relative h-44 overflow-hidden shrink-0">
      {imageUrl
        ? <img src={imageUrl} alt={doctor.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        : <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center"><span className="text-6xl font-black text-indigo-200">{doctor.name?.[0]}</span></div>}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
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
    <div className="p-5 flex flex-col flex-1">
      <h3 className="font-extrabold text-slate-900 tracking-tight text-base">Dr. {doctor.name}</h3>
      {doctor.hospitalName && (
        <div className="flex items-center gap-1.5 mt-1.5 text-slate-400">
          <Building2 size={11} /><span className="text-[11px] truncate">{doctor.hospitalName}</span>
        </div>
      )}
      <div className="mt-auto pt-4">
        <button className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold text-[11px] uppercase tracking-widest group-hover:shadow-lg group-hover:shadow-indigo-100 transition-all duration-300">
          Select Doctor
        </button>
      </div>
    </div>
  </div>
);

export default SlotBooking;
