import React from 'react';
import { HeartPulse, ShieldCheck, Users2 } from 'lucide-react';
import Reveal from './Reveal';

const VALUES = [
  {
    icon: <HeartPulse size={20} className="text-indigo-600" />,
    title: 'Patients come first',
    description: 'Every feature starts with one question: does this make care easier to get, or harder?',
  },
  {
    icon: <ShieldCheck size={20} className="text-indigo-600" />,
    title: 'Trust is earned in the details',
    description: 'Secure messaging, careful access controls, and clear consent — not an afterthought.',
  },
  {
    icon: <Users2 size={20} className="text-indigo-600" />,
    title: 'Built with clinicians, not just for them',
    description: 'Doctors and clinic staff shape the workflows so the tool fits real days, not demos.',
  },
];

const About = () => (
  <section id="about" className="max-w-5xl mx-auto px-6 md:px-10 py-20 md:py-28">
    <Reveal className="text-center">
      <p className="text-[11px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-3">About Us</p>
      <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">
        Healthcare software that gets out of the way
      </h2>
      <p className="text-slate-500 mt-4 max-w-2xl mx-auto leading-relaxed">
        AuraHealth started with a simple frustration: booking a doctor and getting a straight
        answer about a report shouldn't take a dozen phone calls. We're building the platform
        we wished existed — for patients, doctors and the clinics that connect them.
      </p>
    </Reveal>

    <div className="grid md:grid-cols-3 gap-6 mt-14">
      {VALUES.map((v, i) => (
        <Reveal key={v.title} delay={i * 80}>
          <div className="bg-white border border-slate-100 rounded-2xl p-8 h-full hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300">
            <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
              {v.icon}
            </div>
            <h3 className="font-black text-slate-900 tracking-tight text-lg">{v.title}</h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">{v.description}</p>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

export default About;
