import React from 'react';
import Reveal from './Reveal';

const SECTIONS = [
  {
    title: 'Information we collect',
    body: 'When you create an account, we collect basic profile details such as your name, email, contact number and role (patient, doctor or clinic). When you book or complete an appointment, we store the appointment details, messages exchanged with your doctor, and any reports you choose to upload for AI-assisted analysis.',
  },
  {
    title: 'How we use it',
    body: 'Your information is used to run the core service: matching you with doctors, keeping appointments organized, powering AI report summaries, and enabling secure messaging. We do not sell your personal or health data to third parties.',
  },
  {
    title: 'How we protect it',
    body: 'Access to patient records is restricted to the patient and the doctors they interact with. Messages and reports are tied to your account and protected behind authentication — we design every new feature with this boundary in mind.',
  },
  {
    title: 'Your choices',
    body: 'You can review and update your profile information at any time from your dashboard. If you would like your account or data removed, contact our support team and we will guide you through the process.',
  },
  {
    title: 'Cookies',
    body: 'We use essential cookies to keep you signed in and to remember your session. We do not use third-party advertising trackers.',
  },
];

const Privacy = () => (
  <section id="privacy" className="max-w-3xl mx-auto px-6 md:px-10 py-20 md:py-28">
    <Reveal className="text-center mb-14">
      <p className="text-[11px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-3">Privacy Policy</p>
      <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">
        Your data, handled with care
      </h2>
      <p className="text-slate-500 mt-4 leading-relaxed">
        What AuraHealth collects, how it's used, and the choices you have. Last updated{' '}
        {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}.
      </p>
    </Reveal>

    <div className="space-y-10">
      {SECTIONS.map((s, i) => (
        <Reveal key={s.title} delay={i * 60}>
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2">{s.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{s.body}</p>
          </div>
        </Reveal>
      ))}

      <Reveal>
        <div className="bg-white border border-slate-100 rounded-2xl p-6">
          <p className="text-sm text-slate-500">
            Questions about this policy? Reach out any time at{' '}
            <a href="mailto:support@aurahealth.app" className="font-bold text-indigo-600 hover:text-indigo-700">
              support@aurahealth.app
            </a>
            .
          </p>
        </div>
      </Reveal>
    </div>
  </section>
);

export default Privacy;
