import React from "react";
import { CheckCircle2, Clock, Calendar } from "lucide-react";
import { formatTime } from "./utils";

const SuccessScreen = ({ selectedDoctor, selectedDate, selectedSlot, onReset }) => (
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
        onClick={onReset}
        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold rounded-2xl shadow-lg hover:opacity-90 transition-all"
      >
        Book Another Slot
      </button>
    </div>
  </div>
);

export default SuccessScreen;
