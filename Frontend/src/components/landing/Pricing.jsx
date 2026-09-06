import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';
import Reveal from './Reveal';

const PLANS = [
  {
    name: 'Basic',
    price: { monthly: 'Free', yearly: 'Free' },
    period: '',
    description: 'Everything a patient needs to get started.',
    features: ['Book appointments with any doctor', 'Real-time slot booking', 'Secure doctor messaging', '1 AI report analysis / month'],
    cta: 'Get Started',
    note: 'No credit card required',
    highlighted: false,
  },
  {
    name: 'Plus',
    price: { monthly: '$9', yearly: '$7' },
    period: '/ month',
    description: 'For patients who want priority care.',
    features: ['Everything in Basic', 'Priority appointment slots', 'Unlimited AI report analysis', 'Live AI capture consultations', 'Faster support response'],
    cta: 'Start Free Trial',
    note: 'Cancel anytime',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Clinic',
    price: { monthly: '$49', yearly: '$39' },
    period: '/ month',
    description: 'For doctors and clinics managing patients at scale.',
    features: ['Everything in Plus', 'Multi-doctor dashboard', 'Patient history & analytics', 'Team chat & scheduling tools', 'Dedicated account manager'],
    cta: 'Talk to Sales',
    note: 'Custom invoicing available',
    highlighted: false,
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing">
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-20 md:py-28">
        <Reveal className="text-center">
          <p className="text-[11px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-3">Plans</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Simple plans for patients &amp; clinics
          </h2>

          <div className="inline-flex items-center gap-1 mt-8 p-1 rounded-full bg-slate-100">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-colors duration-200 ${
                !yearly ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-colors duration-200 ${
                yearly ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              Yearly
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Save 20%</span>
            </button>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 mt-14 items-start">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 80}>
              <div
                className={`relative rounded-3xl p-8 transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-indigo-600 text-white shadow-lg md:-translate-y-4'
                    : 'bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-md'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white text-indigo-600 text-[11px] font-bold shadow-sm whitespace-nowrap">
                    <Sparkles size={12} /> {plan.badge}
                  </span>
                )}

                <h3 className={`font-bold text-lg tracking-tight ${plan.highlighted ? 'text-white' : 'text-slate-800'}`}>{plan.name}</h3>
                <p className={`text-sm mt-2 ${plan.highlighted ? 'text-indigo-100' : 'text-slate-500'}`}>{plan.description}</p>

                <div className="flex items-baseline gap-1 mt-6 mb-1">
                  <span className="text-4xl font-bold tracking-tight">{plan.price[yearly ? 'yearly' : 'monthly']}</span>
                  {plan.period && <span className={`text-sm font-bold ${plan.highlighted ? 'text-indigo-100' : 'text-slate-400'}`}>{plan.period}</span>}
                </div>
                <p className={`text-xs font-semibold mb-8 ${plan.highlighted ? 'text-indigo-100' : 'text-slate-400'}`}>
                  {plan.price.monthly === 'Free' ? ' ' : yearly ? 'billed annually' : 'billed monthly'}
                </p>

                <ul className="space-y-3.5 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <Check size={18} className={`shrink-0 mt-0.5 ${plan.highlighted ? 'text-white' : 'text-indigo-600'}`} />
                      <span className={`text-sm ${plan.highlighted ? 'text-white' : 'text-slate-600'}`}>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate('/Userregister')}
                  className={`w-full py-3.5 font-bold rounded-2xl transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] ${
                    plan.highlighted ? 'bg-white text-indigo-600 shadow-lg hover:opacity-90' : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {plan.cta}
                </button>
                {plan.note && (
                  <p className={`text-center text-xs font-semibold mt-3 ${plan.highlighted ? 'text-indigo-100' : 'text-slate-400'}`}>{plan.note}</p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
