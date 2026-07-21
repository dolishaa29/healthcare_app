import React from 'react';
import { CalendarClock, Activity, Bell, MessageCircle, Video, Minus, Check } from 'lucide-react';
import Reveal from './Reveal';

const COMPARISON = [
  {
    label: 'Booking',
    icon: <CalendarClock size={16} />,
    traditional: 'Phone calls & waiting rooms',
    aura: 'Real-time event scheduling',
  },
  {
    label: 'Reports',
    icon: <Activity size={16} />,
    traditional: 'Manual review, no flags',
    aura: 'Live report analyzer with alerts',
  },
  {
    label: 'Follow-ups',
    icon: <Bell size={16} />,
    traditional: 'Easy to forget',
    aura: 'Instant, automatic responses',
  },
  {
    label: 'Communication',
    icon: <MessageCircle size={16} />,
    traditional: 'Scattered across calls & texts',
    aura: 'One secure chat thread',
  },
  {
    label: 'Consultations',
    icon: <Video size={16} />,
    traditional: 'In-person only',
    aura: 'Live video meets with AI capture',
  },
];

const ComparisonTable = () => (
  <section className="max-w-5xl mx-auto px-6 md:px-10 py-20 md:py-28">
    <Reveal className="text-center">
      <p className="text-[11px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-3">The difference</p>
      <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">
        Traditional clinic software vs. AuraHealth
      </h2>
      <p className="text-slate-500 mt-3 max-w-xl mx-auto">
        Every row below is a feature you can try right now — not a roadmap promise.
      </p>
    </Reveal>

    <Reveal delay={80} className="mt-14 bg-white border border-slate-100 rounded-3xl shadow-xl shadow-indigo-500/5 overflow-x-auto">
      <div className="min-w-[620px]">
        <div className="grid grid-cols-[1.1fr_1fr_1.2fr] bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white text-sm font-bold">
          <div className="px-6 py-4 text-indigo-200">Feature</div>
          <div className="px-6 py-4">Traditional</div>
          <div className="px-6 py-4">AuraHealth</div>
        </div>
        {COMPARISON.map((row, i) => (
          <div
            key={row.label}
            className={`grid grid-cols-[1.1fr_1fr_1.2fr] text-sm hover:bg-indigo-50/50 transition-colors duration-200 ${
              i % 2 === 0 ? 'bg-white' : 'bg-indigo-50/20'
            }`}
          >
            <div className="px-6 py-5 flex items-center gap-3 font-bold text-slate-800">
              <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                {row.icon}
              </span>
              {row.label}
            </div>
            <div className="px-6 py-5 text-slate-400 flex items-start gap-2">
              <Minus size={16} className="shrink-0 mt-0.5" /> {row.traditional}
            </div>
            <div className="px-6 py-5">
              <span className="inline-flex items-start gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-slate-700 font-semibold px-3 py-1.5 rounded-lg">
                <Check size={16} className="shrink-0 mt-0.5 text-indigo-600" /> {row.aura}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  </section>
);

export default ComparisonTable;
