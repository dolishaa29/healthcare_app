import React from "react";
import { ChevronLeft, FileText, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { formatTime } from "./utils";

const SummaryRow = ({ label, value, highlight }) => (
  <div className="flex items-center justify-between">
    <span className="text-xs text-slate-400 font-semibold">{label}</span>
    <span className={`text-xs font-bold ${highlight ? "text-indigo-600" : "text-slate-700"}`}>{value}</span>
  </div>
);

const BookingConfirmStep = ({
  selectedDoctor,
  selectedDate,
  selectedSlot,
  description,
  onDescriptionChange,
  error,
  submitting,
  onBack,
  onSubmit,
}) => (
  <div className="max-w-xl">
    <button
      onClick={onBack}
      className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-indigo-600 transition-colors mb-6"
    >
      <ChevronLeft size={14} strokeWidth={2.5} /> Back to Slots
    </button>

    <div className="motion-safe:animate-[fadeInUp_0.35s_ease-out_both] bg-white border border-slate-100 rounded-3xl p-5 mb-4 shadow-sm">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Booking Summary</p>
      <div className="space-y-2.5">
        <SummaryRow label="Doctor" value={`Dr. ${selectedDoctor?.name}`} />
        <SummaryRow label="Specialization" value={selectedDoctor?.specialization} />
        <SummaryRow label="Date" value={selectedDate} />
        <SummaryRow label="Time" value={formatTime(selectedSlot)} highlight />
      </div>
    </div>

    <div className="motion-safe:animate-[fadeInUp_0.35s_ease-out_both] bg-white border border-slate-100 rounded-3xl p-5 mb-4 shadow-sm" style={{ animationDelay: '60ms' }}>
      <div className="flex items-center gap-2 mb-3">
        <FileText size={14} className="text-indigo-500" />
        <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Reason for Visit</label>
      </div>
      <textarea
        placeholder="Describe your symptoms or health concern..."
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
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
      onClick={onSubmit}
      disabled={submitting || !description.trim()}
      className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
    >
      {submitting
        ? <><Loader2 size={17} className="animate-spin" /> Booking...</>
        : <><CheckCircle2 size={16} /> Confirm Appointment</>}
    </button>
  </div>
);

export default BookingConfirmStep;
