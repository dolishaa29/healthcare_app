import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   TEMP: inline stand-in so this file previews on its own.
   In your project, DELETE this block and restore:
       import Reveal from './Reveal';
   ───────────────────────────────────────────────────────────── */
const Reveal = ({ children, className = '', delay = 0 }) => {
  const [shown, setShown] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setShown(true), delay);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${className}`}
    >
      {children}
    </div>
  );
};
/* ───────────────────────── end temp block ───────────────────── */

const FAQS = [
  {
    q: 'How is AuraHealth different from other health apps?',
    a: 'Most health apps are a digital form for booking. AuraHealth actively works for you: it flags abnormal reports, refills empty slots, and reminds patients about follow-ups automatically, instead of just storing records.',
  },
  {
    q: 'Is AuraHealth free to use for patients?',
    a: 'Yes. The Basic plan is free forever and covers booking, messaging and one AI report analysis a month. Upgrade to Plus anytime for unlimited analysis and priority slots.',
  },
  {
    q: 'How does the Live AI Capture feature work?',
    a: 'During a video consultation you can open your camera and our AI assists in real time, surfacing observations for your doctor to review alongside the live feed.',
  },
  {
    q: 'Can doctors join as part of a clinic?',
    a: 'Yes. The Clinic plan gives clinics a shared dashboard so multiple doctors can manage requests, schedules and patient history in one place.',
  },
  {
    q: 'Is my medical data secure?',
    a: 'All messaging and report uploads are encrypted in transit, and access is restricted to you and the doctors you choose to consult with.',
  },
];

const FaqItem = forwardRef(({ q, a, index, isOpen, onToggle, onKeyDown }, ref) => {
  const triggerId = `faq-trigger-${index}`;
  const panelId = `faq-panel-${index}`;

  return (
    <div className="border-b border-slate-100">
      <h3 className="m-0">
        <button
          ref={ref}
          id={triggerId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          onKeyDown={onKeyDown}
          className="group w-full flex items-center justify-between gap-4 text-left py-5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          <span
            className={`font-bold tracking-tight transition-colors duration-200 ${
              isOpen ? 'text-indigo-700' : 'text-slate-800 group-hover:text-indigo-700'
            }`}
          >
            {q}
          </span>
          <span
            className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
              isOpen ? 'bg-indigo-600' : 'bg-indigo-50 group-hover:bg-indigo-100'
            }`}
          >
            <ChevronDown
              size={16}
              aria-hidden="true"
              className={`transition-transform duration-300 motion-reduce:transition-none ${
                isOpen ? 'rotate-180 text-white' : 'text-indigo-600'
              }`}
            />
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className={`grid transition-all duration-300 ease-out motion-reduce:transition-none ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-sm text-slate-600 leading-relaxed pb-5 max-w-2xl">{a}</p>
        </div>
      </div>
    </div>
  );
});

FaqItem.displayName = 'FaqItem';

const FAQ = () => {
  // Single-open accordion. To allow several open at once, swap this for a
  // Set of indices and toggle membership instead.
  const [openIndex, setOpenIndex] = useState(null);
  const triggerRefs = useRef([]);

  const handleKeyDown = (e, i) => {
    const last = FAQS.length - 1;
    let next = null;
    if (e.key === 'ArrowDown') next = i === last ? 0 : i + 1;
    else if (e.key === 'ArrowUp') next = i === 0 ? last : i - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    if (next !== null) {
      e.preventDefault();
      triggerRefs.current[next]?.focus();
    }
  };

  return (
    <section id="faq" className="max-w-3xl mx-auto px-6 md:px-10 py-20 md:py-28">
      <Reveal className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-black tracking-tighter bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
          Frequently asked questions
        </h2>
      </Reveal>

      <div>
        {FAQS.map((item, i) => (
          <Reveal key={item.q} delay={i * 50}>
            <FaqItem
              ref={(el) => (triggerRefs.current[i] = el)}
              index={i}
              q={item.q}
              a={item.a}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex((cur) => (cur === i ? null : i))}
              onKeyDown={(e) => handleKeyDown(e, i)}
            />
          </Reveal>
        ))}
      </div>

      <Reveal className="text-center mt-12">
        <p className="text-sm text-slate-500">
          Still have questions?{' '}
          <a
            href="#contact"
            className="font-semibold text-indigo-600 hover:text-indigo-700 underline underline-offset-4 decoration-indigo-200 hover:decoration-indigo-400 transition-colors"
          >
            Talk to our team
          </a>
        </p>
      </Reveal>
    </section>
  );
};

export default FAQ;