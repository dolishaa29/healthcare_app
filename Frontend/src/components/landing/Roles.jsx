import React from 'react';
import { Users, Stethoscope, Building2, Check } from 'lucide-react';
import Reveal from './Reveal';

const ROLES = [
  {
    role: 'Patients',
    icon: <Users size={20} className="text-indigo-600" />,
    description: 'Book, consult and follow up without ever picking up the phone.',
    items: ['Find & book verified doctors', 'Live AI-assisted consultations', 'Instant report analysis', 'Rate and review your visits'],
  },
  {
    role: 'Doctors',
    icon: <Stethoscope size={20} className="text-indigo-600" />,
    description: 'Spend the day treating patients, not managing a calendar.',
    items: ['Auto-organized appointment queue', 'Patient history in one view', 'Secure in-app messaging', 'Fewer no-shows, fewer gaps'],
  },
  {
    role: 'Clinics',
    icon: <Building2 size={20} className="text-indigo-600" />,
    description: 'Give every doctor on your team the same system.',
    items: ['Multi-doctor dashboard', 'Clinic-wide analytics', 'Centralized scheduling', 'Dedicated support'],
  },
];

const Roles = () => (
  <section id="roles" className="max-w-5xl mx-auto px-6 md:px-10 py-20 md:py-28">
    <Reveal className="text-center">
      <h2 className="text-3xl md:text-4xl font-black tracking-tighter bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
        One platform, every role in the care journey
      </h2>
    </Reveal>

    <div className="grid md:grid-cols-3 gap-6 mt-14">
      {ROLES.map((r, i) => (
        <Reveal key={r.role} delay={i * 80}>
          <div className="bg-white border border-slate-100 rounded-2xl p-8 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300">
            <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
              {r.icon}
            </div>
            <h3 className="font-black text-slate-900 tracking-tight text-lg">{r.role}</h3>
            <p className="text-sm text-slate-500 mt-2 mb-6">{r.description}</p>
            <ul className="space-y-3">
              {r.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                  <Check size={16} className="text-indigo-600 shrink-0 mt-0.5" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

export default Roles;
