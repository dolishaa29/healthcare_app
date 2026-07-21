import React from 'react';
import { ArrowUpRight, HeartPulse, Brain, Salad } from 'lucide-react';
import Reveal from './Reveal';

const ARTICLES = [
  {
    icon: <HeartPulse size={18} className="text-rose-500" />,
    tag: 'Heart Health',
    tagBg: 'bg-rose-50',
    title: 'Reading your first cardiology report without the jargon',
    readTime: '5 min read',
  },
  {
    icon: <Brain size={18} className="text-indigo-500" />,
    tag: 'Mental Health',
    tagBg: 'bg-indigo-50',
    title: 'What a good telehealth therapy session actually looks like',
    readTime: '4 min read',
  },
  {
    icon: <Salad size={18} className="text-emerald-500" />,
    tag: 'Nutrition',
    tagBg: 'bg-emerald-50',
    title: 'Lab-backed diet changes your doctor actually recommends',
    readTime: '6 min read',
  },
];

const Resources = () => (
  <section className="bg-white border-y border-slate-100">
    <div className="max-w-5xl mx-auto px-6 md:px-10 py-20 md:py-28">
      <Reveal className="flex items-end justify-between gap-6 mb-14 flex-wrap">
        <div>
          <p className="text-[11px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-3">Resources</p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">
            Health guides worth your time
          </h2>
        </div>
        <span className="text-sm font-bold text-slate-400">More articles coming soon</span>
      </Reveal>

      <div className="grid md:grid-cols-3 gap-6">
        {ARTICLES.map((a, i) => (
          <Reveal key={a.title} delay={i * 80}>
            <div className="group bg-white border border-slate-100 rounded-2xl p-6 h-full hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-5">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-slate-600 ${a.tagBg}`}>
                  {a.icon} {a.tag}
                </span>
                <ArrowUpRight size={18} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <h3 className="font-bold text-slate-900 tracking-tight leading-snug">{a.title}</h3>
              <p className="text-xs font-bold text-slate-400 mt-4">{a.readTime}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Resources;
