import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarClock, FileText, Video, Sparkles, ArrowRight, Stethoscope } from 'lucide-react';

const HERO_POINTS = [
  { icon: <CalendarClock size={18} className="text-indigo-500" />, label: 'Auto slot booking' },
  { icon: <FileText size={18} className="text-indigo-500" />, label: 'AI report scoring' },
  { icon: <Video size={18} className="text-indigo-500" />, label: 'Live consultation capture' },
];

const AVATARS = [
  { initials: 'AK', bg: 'bg-indigo-100', text: 'text-indigo-700' },
  { initials: 'RS', bg: 'bg-violet-100', text: 'text-violet-700' },
  { initials: 'MP', bg: 'bg-indigo-200', text: 'text-indigo-800' },
];

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-slate-50">
      <div className="motion-safe:animate-[floatSlow_9s_ease-in-out_infinite] absolute top-[-10%] left-[-5%] w-96 h-96 bg-indigo-200/40 blur-[100px] rounded-full" />
      <div className="motion-safe:animate-[floatSlower_11s_ease-in-out_infinite] absolute top-[5%] right-[-5%] w-96 h-96 bg-violet-200/40 blur-[100px] rounded-full" />

      <div className="relative max-w-4xl mx-auto px-6 pt-32 pb-4 md:pt-40 text-center">
        <div
          className="motion-safe:animate-[fadeInUp_0.6s_ease-out_both] inline-flex items-center gap-3 px-3 py-2 pr-4 bg-white border border-slate-200 rounded-full shadow-sm mb-8"
        >
          <div className="flex -space-x-2">
            {AVATARS.map((a) => (
              <div
                key={a.initials}
                className={`w-6 h-6 rounded-full ring-2 ring-white flex items-center justify-center text-[9px] font-bold ${a.bg} ${a.text}`}
              >
                {a.initials}
              </div>
            ))}
          </div>
          <span className="text-xs font-semibold text-slate-600">Trusted by thousands of patients</span>
        </div>

        <h1
          className="motion-safe:animate-[fadeInUp_0.6s_ease-out_both] text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]"
          style={{ animationDelay: '70ms' }}
        >
          Book, Consult, Follow Up —<br />All Without Leaving Home
        </h1>

        <p
          className="motion-safe:animate-[fadeInUp_0.6s_ease-out_both] text-slate-500 text-base md:text-lg max-w-xl mx-auto mt-6 leading-relaxed"
          style={{ animationDelay: '140ms' }}
        >
          Book trusted doctors, consult over live video with AI-assisted analysis, and keep every
          report and message in one secure portal — built for patients and clinics alike.
        </p>

        <div
          className="motion-safe:animate-[fadeInUp_0.6s_ease-out_both] flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          style={{ animationDelay: '210ms' }}
        >
          <button
            onClick={() => navigate('/Userregister')}
            className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-sm transition-colors duration-200 active:scale-[0.98] inline-flex items-center justify-center gap-2"
          >
            <Stethoscope size={18} /> Get Started Free
          </button>
          <button
            onClick={() => navigate('/Doctorregister')}
            className="px-7 py-3.5 text-indigo-700 hover:bg-indigo-50 font-semibold rounded-full transition-colors duration-200 inline-flex items-center justify-center gap-2"
          >
            Join as a Doctor <ArrowRight size={16} />
          </button>
        </div>

        <div
          className="motion-safe:animate-[fadeInUp_0.6s_ease-out_both] flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-12"
          style={{ animationDelay: '280ms' }}
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
        className="motion-safe:animate-[fadeInUp_0.7s_ease-out_both] relative max-w-lg mx-auto px-6 pt-16 pb-20 md:pb-28"
        style={{ animationDelay: '350ms' }}
      >
        <div className="relative mx-auto w-64">
          <div className="rounded-[2.25rem] border-[6px] border-slate-900 bg-slate-900 shadow-2xl overflow-hidden">
            <div className="bg-white aspect-9/19 flex flex-col">
              <div className="h-6 flex items-center justify-center shrink-0">
                <div className="w-16 h-1.5 bg-slate-900 rounded-full" />
              </div>
              <div className="flex-1 px-4 pb-4 flex flex-col gap-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">My Appointments</p>

                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                      MA
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-800">Dr. Meera Anand</p>
                      <p className="text-[9px] text-slate-400">Cardiologist</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-2 py-1.5 bg-white rounded-lg mb-2 border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-600">Today, 10:00 AM</span>
                    <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">Confirmed</span>
                  </div>
                  <button className="w-full py-2 bg-indigo-600 text-white text-[10px] font-bold rounded-lg flex items-center justify-center gap-1">
                    <Video size={11} /> Join Video Call
                  </button>
                </div>

                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'conic-gradient(#566b2e 0% 92%, #e7ecd7 92% 100%)' }}
                  >
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                      <span className="text-[10px] font-bold text-slate-900">92</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-800">Report reviewed</p>
                    <p className="text-[9px] text-emerald-600 font-bold">Normal range</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -right-10 top-16 hidden sm:flex items-center gap-2 bg-white border border-slate-100 rounded-2xl shadow-lg shadow-slate-200/60 px-3 py-2.5">
            <Sparkles size={14} className="text-indigo-600" />
            <span className="text-[11px] font-bold text-slate-700">AI Symptom Triage</span>
          </div>
          <div className="absolute -left-12 bottom-24 hidden sm:flex items-center gap-2 bg-white border border-slate-100 rounded-2xl shadow-lg shadow-slate-200/60 px-3 py-2.5">
            <FileText size={14} className="text-indigo-600" />
            <span className="text-[11px] font-bold text-slate-700">Instant Report Analysis</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
