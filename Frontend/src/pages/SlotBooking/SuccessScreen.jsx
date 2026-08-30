import React from "react";
import { CheckCircle2, Clock, Calendar } from "lucide-react";
import { formatTime } from "./utils";

const SuccessScreen = ({ selectedDoctor, selectedDate, selectedSlot, onReset }) => (
  <div className="h-full overflow-y-auto bg-slate-50 flex items-center justify-center p-6 sm:p-10">
    <div className="motion-safe:animate-[fadeInUp_0.4s_ease-out_both] text-center max-w-md">
      <div className="relative mx-auto mb-8 w-24 h-24">
        <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-30" />
        <div className="relative w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-xl">
          <CheckCircle2 className="text-white" size={44} strokeWidth={1.5} />
        </div>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">Appointment Booked!</h2>
      <p className="text-slate-400 text-sm mb-1">Your slot is confirmed with</p>
      <p className="text-indigo-600 font-bold text-xl mb-2">Dr. {selectedDoctor?.name}</p>
      <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mb-8 flex-wrap">
        <Calendar size={14} />
        <span>{selectedDate}</span>
        <Clock size={14} className="ml-2" />
        <span>{formatTime(selectedSlot)}</span>
      </div>
      <button
        onClick={onReset}
        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-sm transition-all"
      >
        Book Another Slot
      </button>
    </div>
  </div>
);

export default SuccessScreen;
