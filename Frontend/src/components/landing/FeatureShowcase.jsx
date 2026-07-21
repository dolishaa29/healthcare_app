import React from 'react';
import { Video, Check } from 'lucide-react';
import Reveal from './Reveal';

const SHOWCASE = [
  {
    eyebrow: 'Booking',
    title: 'Slots that fill themselves',
    description: 'Patients see real doctor availability and book in seconds. No double-booking, no phone tag, no wasted slots.',
    bullets: ['Real-time availability', 'Instant confirmation', 'Automatic reminders'],
    variant: 'booking',
  },
  {
    eyebrow: 'Reports',
    title: 'Reports that flag themselves',
    description: 'Upload a lab or skin report and get an instant AI-assisted summary the doctor can review before the visit even starts.',
    bullets: ['Plain-language summary', 'Abnormal result flags', 'Shared straight with the doctor'],
    variant: 'reports',
  },
  {
    eyebrow: 'Consultations',
    title: 'Consults with an extra set of eyes',
    description: 'Open a live video session and let AI-assisted capture surface observations in real time, right alongside the feed.',
    bullets: ['One-tap live video', 'Real-time AI capture', 'No extra hardware'],
    variant: 'video',
  },
  {
    eyebrow: 'Messaging',
    title: 'One thread, not five apps',
    description: 'Every message between a patient and their doctor stays in one encrypted thread, before and after the appointment.',
    bullets: ['End-to-end encrypted', 'Tied to the patient record', 'Available on any device'],
    variant: 'messaging',
  },
];

const SLOTS = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM'];

const BookingMock = () => (
  <div className="space-y-2.5">
    {SLOTS.map((slot, i) => (
      <div
        key={slot}
        className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold ${
          i === 2 ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-200' : 'bg-white text-slate-400 border border-slate-100'
        }`}
      >
        {slot}
        {i === 2 && <Check size={16} />}
      </div>
    ))}
  </div>
);

const ReportsMock = () => (
  <div className="flex items-center gap-6">
    <div
      className="w-24 h-24 rounded-full flex items-center justify-center shrink-0"
      style={{ background: 'conic-gradient(#7c3aed 0% 92%, #e9d5ff 92% 100%)' }}
    >
      <div className="w-[72px] h-[72px] rounded-full bg-white flex flex-col items-center justify-center">
        <span className="text-xl font-black text-slate-900">92</span>
        <span className="text-[9px] font-bold text-slate-400 uppercase">Score</span>
      </div>
    </div>
    <div className="space-y-2">
      <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">Normal range</span>
      <div className="w-32 h-2 rounded-full bg-white" />
      <div className="w-24 h-2 rounded-full bg-white/70" />
    </div>
  </div>
);

const VideoMock = () => (
  <div className="w-full">
    <div className="flex items-center justify-between mb-4">
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-500 text-xs font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> LIVE
      </span>
      <Video size={16} className="text-slate-300" />
    </div>
    <div className="flex items-center justify-center gap-4">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-black">Dr</div>
      <div className="flex-1 h-px border-t-2 border-dashed border-indigo-200" />
      <div className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 font-black">Pt</div>
    </div>
  </div>
);

const MessagingMock = () => (
  <div className="w-full space-y-2.5">
    <div className="max-w-[75%] bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-2.5 text-xs font-bold text-slate-500">
      How are you feeling after the last dose?
    </div>
    <div className="max-w-[75%] ml-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl rounded-br-sm px-4 py-2.5 text-xs font-bold text-white">
      Much better, thank you!
    </div>
  </div>
);

const MOCKS = { booking: BookingMock, reports: ReportsMock, video: VideoMock, messaging: MessagingMock };

const MockCard = ({ variant }) => {
  const Content = MOCKS[variant];
  return (
    <div className="relative rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100" />
      <div className="relative m-3 rounded-xl bg-white/60 backdrop-blur-xl border border-white/60 shadow-xl overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/60">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300/70" />
        </div>
        <div className="p-8 flex items-center justify-center min-h-[220px]">
          <Content />
        </div>
      </div>
    </div>
  );
};

const FeatureShowcase = () => (
  <section id="features" className="max-w-5xl mx-auto px-6 md:px-10 py-20 md:py-28 space-y-20 md:space-y-28">
    {SHOWCASE.map((f, i) => (
      <Reveal key={f.title} className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}>
        <div>
          <p className="text-[11px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-3">{f.eyebrow}</p>
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">{f.title}</h3>
          <p className="text-slate-500 mt-4 leading-relaxed">{f.description}</p>
          <ul className="mt-6 space-y-3">
            {f.bullets.map((b) => (
              <li key={b} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                <Check size={16} className="text-indigo-600 shrink-0" /> {b}
              </li>
            ))}
          </ul>
        </div>
        <div className="hover:-translate-y-1.5 transition-transform duration-300">
          <MockCard variant={f.variant} />
        </div>
      </Reveal>
    ))}
  </section>
);

export default FeatureShowcase;
