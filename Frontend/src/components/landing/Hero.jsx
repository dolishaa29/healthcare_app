import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarClock, FileText, Video, Sparkles, ArrowRight } from 'lucide-react';

const HERO_POINTS = [
  { icon: <CalendarClock size={18} className="text-indigo-500" />, label: 'Auto slot booking' },
  { icon: <FileText size={18} className="text-indigo-500" />, label: 'AI report scoring' },
  { icon: <Video size={18} className="text-indigo-500" />, label: 'Live consultation capture' },
];

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      <div className="motion-safe:animate-[floatSlow_9s_ease-in-out_infinite] absolute top-[-10%] left-[-5%] w-96 h-96 bg-purple-200/40 blur-[100px] rounded-full" />
      <div className="motion-safe:animate-[floatSlower_11s_ease-in-out_infinite] absolute top-[10%] right-[-5%] w-96 h-96 bg-blue-200/40 blur-[100px] rounded-full" />

      <div className="relative max-w-6xl mx-auto px-6 md:px-10 pt-20 pb-20 md:pt-28 md:pb-28 grid md:grid-cols-2 gap-14 items-center">
        <div className="text-center md:text-left">
          <div className="motion-safe:animate-[fadeInUp_0.6s_ease-out_both] inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md border border-white/60 rounded-full shadow-sm mb-8">
            <Sparkles size={14} className="text-purple-600" />
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">AI-Assisted Healthcare Platform</span>
          </div>

          <h1
            className="motion-safe:animate-[fadeInUp_0.6s_ease-out_both] text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[1.1]"
            style={{ animationDelay: '70ms' }}
          >
            AuraHealth is the AI operating system for healthcare.
          </h1>
          <p
            className="motion-safe:animate-[fadeInUp_0.6s_ease-out_both] text-2xl md:text-3xl font-black tracking-tight bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mt-4"
            style={{ animationDelay: '140ms' }}
          >
            Give your clinic a pulse.
          </p>

          <p
            className="motion-safe:animate-[fadeInUp_0.6s_ease-out_both] text-slate-500 text-base md:text-lg max-w-xl mx-auto md:mx-0 mt-6 leading-relaxed"
            style={{ animationDelay: '210ms' }}
          >
            Book trusted doctors, consult over live video with AI-assisted analysis, and keep every
            report and message in one secure portal — built for patients and clinics alike.
          </p>

          <div
            className="motion-safe:animate-[fadeInUp_0.6s_ease-out_both] flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mt-10"
            style={{ animationDelay: '280ms' }}
          >
            <button
              onClick={() => navigate('/Userregister')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-90 text-white font-bold rounded-2xl shadow-xl shadow-purple-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl active:scale-[0.98] inline-flex items-center justify-center gap-2"
            >
              Get Started Free <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/Doctorregister')}
              className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 font-bold rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
            >
              Join as a Doctor
            </button>
          </div>

          <div
            className="motion-safe:animate-[fadeInUp_0.6s_ease-out_both] flex flex-wrap items-center justify-center md:justify-start gap-x-8 gap-y-3 mt-14"
            style={{ animationDelay: '350ms' }}
          >
            {HERO_POINTS.map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-slate-500">
                {icon}
                <span className="text-sm font-bold">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="motion-safe:animate-[fadeInUp_0.7s_ease-out_both] hidden md:block relative h-96"
          style={{ animationDelay: '200ms' }}
        >
          <div className="absolute top-6 right-4 w-56 rotate-6 bg-white/50 backdrop-blur-xl border border-white/60 rounded-2xl shadow-xl p-4">
            <div className="flex items-center gap-3">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'conic-gradient(#7c3aed 0% 92%, #e9d5ff 92% 100%)' }}
              >
                <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex flex-col items-center justify-center">
                  <span className="text-sm font-black text-slate-900">92</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Report reviewed</p>
                <p className="text-[11px] text-emerald-600 font-bold">Normal range</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-2 w-64 -rotate-3 bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl shadow-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-xs font-black shrink-0">
                MA
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Dr. Meera Anand</p>
                <p className="text-xs text-slate-400">Cardiologist</p>
              </div>
            </div>
            <div className="flex items-center justify-between px-3 py-2 bg-white/70 rounded-xl mb-3">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <CalendarClock size={14} className="text-indigo-500" /> Today, 10:00 AM
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Confirmed</span>
            </div>
            <button className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2">
              <Video size={14} /> Join Video Call
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
