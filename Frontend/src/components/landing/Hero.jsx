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
    <section className="relative overflow-hidden bg-slate-50/60">
      <div className="relative max-w-6xl mx-auto px-6 md:px-10 pt-20 pb-20 md:pt-28 md:pb-28 grid md:grid-cols-2 gap-14 items-center">
        <div className="text-center md:text-left">
          <div className="motion-safe:animate-[fadeInUp_0.6s_ease-out_both] inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md border border-white/60 rounded-full shadow-sm mb-8">
            <Sparkles size={14} className="text-purple-600" />
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">AI-Assisted Healthcare Platform</span>
          </div>

          <h1
            className="motion-safe:animate-[fadeInUp_0.6s_ease-out_both] text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]"
            style={{ animationDelay: '70ms' }}
          >
            AuraHealth is the AI operating system for healthcare.
          </h1>
          <p
            className="motion-safe:animate-[fadeInUp_0.6s_ease-out_both] text-2xl md:text-3xl font-semibold tracking-tight text-indigo-600 mt-4"
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
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-sm transition-colors duration-200 active:scale-[0.98] inline-flex items-center justify-center gap-2"
            >
              Get Started Free <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/Doctorregister')}
              className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 text-slate-700 font-semibold rounded-2xl shadow-sm transition-colors duration-200 active:scale-[0.98]"
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
          <div className="absolute top-6 right-4 w-56 bg-white border border-slate-100 rounded-2xl shadow-lg shadow-slate-200/60 p-4">
            <div className="flex items-center gap-3">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'conic-gradient(#4f46e5 0% 92%, #e0e7ff 92% 100%)' }}
              >
                <div className="w-10 h-10 rounded-full bg-white flex flex-col items-center justify-center">
                  <span className="text-sm font-bold text-slate-900">92</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Report reviewed</p>
                <p className="text-[11px] text-emerald-600 font-bold">Normal range</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-2 w-64 bg-white border border-slate-100 rounded-2xl shadow-lg shadow-slate-200/60 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                MA
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Dr. Meera Anand</p>
                <p className="text-xs text-slate-400">Cardiologist</p>
              </div>
            </div>
            <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl mb-3">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <CalendarClock size={14} className="text-indigo-500" /> Today, 10:00 AM
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Confirmed</span>
            </div>
            <button className="w-full py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2">
              <Video size={14} /> Join Video Call
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
