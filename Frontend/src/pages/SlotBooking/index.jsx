import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import SuccessScreen from "./SuccessScreen";
import DoctorSearchStep from "./DoctorSearchStep";
import DateSlotStep from "./DateSlotStep";
import BookingConfirmStep from "./BookingConfirmStep";

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
  const [symptoms, setSymptoms] = useState("");
  const [triageLoading, setTriageLoading] = useState(false);
  const [triageResult, setTriageResult] = useState(null);

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

  const handleTriage = async () => {
    if (!symptoms.trim() || triageLoading) return;
    setTriageLoading(true);
    setTriageResult(null);
    try {
      const res = await axios.post(API + "/triage", { symptoms: symptoms.trim() });
      if (res.data.success) {
        setTriageResult(res.data);
        if (res.data.specialization) setSearch(res.data.specialization);
      }
    } catch {
      setTriageResult({ specialization: null, urgency: "low", reasoning: "Couldn't analyze symptoms right now — try searching manually below." });
    } finally {
      setTriageLoading(false);
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

  const stepLabel = step === 1 ? "Choose a doctor" : step === 2 ? "Pick a date and time" : "Confirm your booking";

  if (success) {
    return (
      <SuccessScreen
        selectedDoctor={selectedDoctor}
        selectedDate={selectedDate}
        selectedSlot={selectedSlot}
        onReset={reset}
      />
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-50 px-6 py-10 md:px-10">
      <div className="motion-safe:animate-[fadeInUp_0.4s_ease-out_both] mb-8">
        <p className="text-[10px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-1">Direct Scheduling</p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          Book a <span className="text-indigo-600">Slot</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">{stepLabel}</p>
      </div>

      <div key={step} className="motion-safe:animate-[fadeInUp_0.35s_ease-out_both]">
        {step === 1 && (
          <DoctorSearchStep
            search={search}
            onSearchChange={setSearch}
            loadingDoctors={loadingDoctors}
            filtered={filtered}
            getImageUrl={getImageUrl}
            onSelectDoctor={(doc) => { setSelectedDoctor(doc); setStep(2); setError(""); }}
            symptoms={symptoms}
            onSymptomsChange={setSymptoms}
            onTriage={handleTriage}
            triageLoading={triageLoading}
            triageResult={triageResult}
          />
        )}

        {step === 2 && (
          <DateSlotStep
            selectedDoctor={selectedDoctor}
            getImageUrl={getImageUrl}
            today={today}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            loadingSlots={loadingSlots}
            hasAppointmentToday={hasAppointmentToday}
            slots={slots}
            selectedSlot={selectedSlot}
            onSelectSlot={(time) => { setSelectedSlot(time); setError(""); }}
            onBack={() => { setStep(1); setSelectedDate(""); setSlots([]); setSelectedSlot(null); }}
            onContinue={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <BookingConfirmStep
            selectedDoctor={selectedDoctor}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            description={description}
            onDescriptionChange={(val) => { setDescription(val); if (error) setError(""); }}
            error={error}
            submitting={submitting}
            onBack={() => setStep(2)}
            onSubmit={handleBookSlot}
          />
        )}
      </div>
    </div>
  );
};

export default SlotBooking;
