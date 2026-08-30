import React, { useState } from 'react';
import { Mail, MessageCircle, MapPin, Send, CheckCircle2 } from 'lucide-react';
import Reveal from './Reveal';

const CHANNELS = [
  {
    icon: <Mail size={20} className="text-indigo-600" />,
    title: 'Email us',
    detail: 'support@aurahealth.app',
    description: 'For account, billing or general questions.',
  },
  {
    icon: <MessageCircle size={20} className="text-indigo-600" />,
    title: 'In-app chat',
    detail: 'Available after sign in',
    description: 'Patients and doctors can message support from their dashboard.',
  },
  {
    icon: <MapPin size={20} className="text-indigo-600" />,
    title: 'Headquarters',
    detail: 'Remote-first team',
    description: 'We work with clinics and patients wherever they are.',
  },
];

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="bg-white border-y border-slate-100">
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-20 md:py-28">
        <Reveal className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            We'd love to hear from you
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 mt-14 mb-10">
          {CHANNELS.map((c, i) => (
            <Reveal key={c.title} delay={i * 80}>
              <div className="bg-white border border-slate-100 rounded-2xl p-6 h-full hover:border-indigo-200 hover:shadow-md transition-all duration-300">
                <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                  {c.icon}
                </div>
                <h3 className="font-bold text-slate-900 tracking-tight">{c.title}</h3>
                <p className="text-sm font-bold text-indigo-600 mt-1">{c.detail}</p>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">{c.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 md:p-10 max-w-2xl mx-auto">
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 size={26} className="text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Message sent</h3>
                <p className="text-slate-500 mt-2">Thanks for reaching out — we'll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-sm transition-colors duration-200 active:scale-[0.98] inline-flex items-center justify-center gap-2"
                >
                  Send Message <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;
