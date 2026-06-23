import React from "react";
import { ChevronLeft, CalendarDays, Clock, Loader2, AlertCircle, CheckCircle2, Building2 } from "lucide-react";
import { formatTime } from "./utils";

const DateSlotStep = ({
  selectedDoctor,
  getImageUrl,
  today,
  selectedDate,
  onDateChange,
  loadingSlots,
  hasAppointmentToday,
  slots,
  selectedSlot,
  onSelectSlot,
  onBack,
  onContinue,
}) => (
  <div className="max-w-2xl">
    <button
      onClick={onBack}
      className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-indigo-600 transition-colors mb-6"
    >
      <ChevronLeft size={14} strokeWidth={2.5} /> Back to Doctors
    </button>

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

    <div className="bg-white border border-slate-100 rounded-3xl p-5 mb-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays size={16} className="text-indigo-500" />
        <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Select Date</label>
      </div>
      <input
        type="date"
        min={today}
        value={selectedDate}
        onChange={onDateChange}
        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all"
      />
    </div>

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
                  onClick={() => onSelectSlot(slot.time)}
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
                  onClick={onContinue}
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
);

export default DateSlotStep;
