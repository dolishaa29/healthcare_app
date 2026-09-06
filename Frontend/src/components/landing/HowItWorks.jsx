import React from 'react';
import { UserPlus, CalendarSearch, Video, FileCheck2 } from 'lucide-react';
import Reveal from './Reveal';

const STEPS = [
  {
    step: '01',
    icon: <UserPlus size={20} className="text-indigo-600" />,
    title: 'Create your account',
    description: 'Sign up as a patient, doctor, or clinic in under a minute — no paperwork.',
  },
  {
    step: '02',
    icon: <CalendarSearch size={20} className="text-indigo-600" />,
    title: 'Find & book a slot',
    description: 'Browse verified doctors and grab a real-time slot that fits your schedule.',
  },
  {
    step: '03',
    icon: <Video size={20} className="text-indigo-600" />,
    title: 'Consult with AI capture',
    description: 'Meet over live video while AI-assisted capture surfaces notes in real time.',
  },
  {
    step: '04',
    icon: <FileCheck2 size={20} className="text-indigo-600" />,
    title: 'Get your report & follow up',
    description: 'Reports, messages and next steps land in one thread you can revisit anytime.',
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="max-w-5xl mx-auto px-6 md:px-10 py-20 md:py-28">
    <Reveal className="text-center">
      <p className="text-[11px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-3">The Process</p>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
        From booking to follow-up in four steps
      </h2>
    </Reveal>

    <div className="relative grid md:grid-cols-4 gap-6 mt-14">
      <div className="hidden md:block absolute top-11 left-[12.5%] right-[12.5%] h-px bg-slate-100" />
      {STEPS.map((s, i) => (
        <Reveal key={s.step} delay={i * 100}>
          <div className="relative bg-white border border-slate-100 rounded-2xl p-6 h-full hover:border-indigo-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                {s.icon}
              </div>
              <span className="text-2xl font-bold text-slate-200 tracking-tight">{s.step}</span>
            </div>
            <h3 className="font-bold text-slate-900 tracking-tight">{s.title}</h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">{s.description}</p>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

export default HowItWorks;
