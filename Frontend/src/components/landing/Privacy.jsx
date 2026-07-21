import React from 'react';
import { ShieldCheck, Database, Settings2, Lock, SlidersHorizontal, Cookie, Mail } from 'lucide-react';
import Reveal from './Reveal';

const SECTIONS = [
  {
    icon: <Database size={18} className="text-indigo-600" />,
    title: 'Information we collect',
    body: 'When you create an account, we collect basic profile details such as your name, email, contact number and role (patient, doctor or clinic). When you book or complete an appointment, we store the appointment details, messages exchanged with your doctor, and any reports you choose to upload for AI-assisted analysis.',
  },
  {
    icon: <Settings2 size={18} className="text-indigo-600" />,
    title: 'How we use it',
    body: 'Your information is used to run the core service: matching you with doctors, keeping appointments organized, powering AI report summaries, and enabling secure messaging. We do not sell your personal or health data to third parties.',
  },
  {
    icon: <Lock size={18} className="text-indigo-600" />,
    title: 'How we protect it',
    body: 'Access to patient records is restricted to the patient and the doctors they interact with. Messages and reports are tied to your account and protected behind authentication — we design every new feature with this boundary in mind.',
  },
  {
    icon: <SlidersHorizontal size={18} className="text-indigo-600" />,
    title: 'Your choices',
    body: 'You can review and update your profile information at any time from your dashboard. If you would like your account or data removed, contact our support team and we will guide you through the process.',
  },
  {
    icon: <Cookie size={18} className="text-indigo-600" />,
    title: 'Cookies',
    body: 'We use essential cookies to keep you signed in and to remember your session. We do not use third-party advertising trackers.',
  },
];

const Privacy = () => (
  <section id="privacy" className="max-w-3xl mx-auto px-6 md:px-10 py-20 md:py-28">
    <Reveal className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-black tracking-tighter bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
        Your data, handled with care
      </h2>
    </Reveal>

    <Reveal>
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm shadow-slate-200/40 overflow-hidden">
        {/* Header strip */}
        <div className="flex items-center justify-between gap-4 px-6 sm:px-8 py-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
              <ShieldCheck size={18} className="text-indigo-600" />
            </div>
            <div>
              <p className="font-black text-slate-900 tracking-tight text-sm">Privacy Policy</p>
              <p className="text-xs text-slate-400">AuraHealth Inc.</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right shrink-0">
            Updated{' '}
            {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
          </span>
        </div>

        {/* Sections */}
        <div className="divide-y divide-slate-100">
          {SECTIONS.map((s, i) => (
            <div key={s.title} className="flex gap-4 px-6 sm:px-8 py-6">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                {s.icon}
              </div>
              <div>
                <h3 className="font-black text-slate-900 tracking-tight text-sm mb-1.5">
                  <span className="text-slate-300 mr-1.5">{String(i + 1).padStart(2, '0')}</span>
                  {s.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact footer */}
        <div className="flex items-center gap-3 px-6 sm:px-8 py-6 bg-slate-50 border-t border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0">
            <Mail size={16} className="text-indigo-600" />
          </div>
          <p className="text-sm text-slate-500">
            Questions about this policy? Reach out at{' '}
            <a href="mailto:support@aurahealth.app" className="font-bold text-indigo-600 hover:text-indigo-700">
              support@aurahealth.app
            </a>
          </p>
        </div>
      </div>
    </Reveal>
  </section>
);

export default Privacy;
