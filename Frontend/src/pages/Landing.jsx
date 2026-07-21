import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope, CalendarClock, Video, FileText, MessageCircle, Users, Building2,
  Menu, X, Check, Minus, Sparkles, ChevronDown, ArrowRight, Brain, Search, Zap, AlertCircle
} from 'lucide-react';

const NAV_LINKS = [
  { label: 'Product', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

const HERO_POINTS = [
  { icon: <CalendarClock size={18} className="text-indigo-500" />, label: 'Auto slot booking' },
  { icon: <FileText size={18} className="text-indigo-500" />, label: 'AI report scoring' },
  { icon: <Video size={18} className="text-indigo-500" />, label: 'Live consultation capture' },
];

const PROBLEMS = [
  {
    issue: 'A slot opens up.',
    gap: 'But no patient is notified in time, so it sits empty.',
  },
  {
    issue: 'A report comes back abnormal.',
    gap: "But no one flags it until the patient's next visit, weeks later.",
  },
  {
    issue: 'A patient misses a follow-up.',
    gap: 'But nobody reaches out, so the thread just goes cold.',
  },
  {
    issue: "A doctor's calendar fills up.",
    gap: 'But there is no simple way to see who needs a callback first.',
  },
];

const SHIFT_STEPS = [
  {
    title: 'It understands',
    description: 'AuraHealth reads appointment history, reports and messages to build a live picture of every patient.',
    icon: <Brain size={20} className="text-indigo-600" />,
  },
  {
    title: 'It identifies',
    description: 'Abnormal results, missed follow-ups and open slots are flagged automatically, not buried in a dashboard.',
    icon: <Search size={20} className="text-indigo-600" />,
  },
  {
    title: 'It acts',
    description: 'Reminders go out, slots get refilled, and doctors see what needs attention first — without extra admin work.',
    icon: <Zap size={20} className="text-indigo-600" />,
  },
];

const COMPARISON = [
  { label: 'Booking', traditional: 'Phone calls & waiting rooms', aura: 'Real-time self-serve slots' },
  { label: 'Reports', traditional: 'Manual review, no flags', aura: 'AI-assisted analysis & alerts' },
  { label: 'Follow-ups', traditional: 'Easy to forget', aura: 'Automatic reminders' },
  { label: 'Communication', traditional: 'Scattered across calls & texts', aura: 'One secure message thread' },
  { label: 'Consultations', traditional: 'In-person only', aura: 'Live video with AI capture' },
];

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

const PLANS = [
  {
    name: 'Basic',
    price: 'Free',
    period: '',
    description: 'Everything a patient needs to get started.',
    features: ['Book appointments with any doctor', 'Real-time slot booking', 'Secure doctor messaging', '1 AI report analysis / month'],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Plus',
    price: '$9',
    period: '/ month',
    description: 'For patients who want priority care.',
    features: ['Everything in Basic', 'Priority appointment slots', 'Unlimited AI report analysis', 'Live AI capture consultations', 'Faster support response'],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Clinic',
    price: '$49',
    period: '/ month',
    description: 'For doctors and clinics managing patients at scale.',
    features: ['Everything in Plus', 'Multi-doctor dashboard', 'Patient history & analytics', 'Team chat & scheduling tools', 'Dedicated account manager'],
    cta: 'Talk to Sales',
    highlighted: false,
  },
];

const FAQS = [
  {
    q: 'How is AuraHealth different from other health apps?',
    a: "Most health apps are a digital form for booking. AuraHealth actively works for you: it flags abnormal reports, refills empty slots, and reminds patients about follow-ups automatically, instead of just storing records.",
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

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 py-6">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 text-left"
      >
        <span className="font-bold text-slate-800 tracking-tight">{q}</span>
        <span className="shrink-0 w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
          <ChevronDown size={16} className={`text-indigo-600 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>
      <div className={`grid transition-all duration-300 ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <p className="text-sm text-slate-500 leading-relaxed mt-3 max-w-2xl">{a}</p>
        </div>
      </div>
    </div>
  );
};

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
    <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-100">
        <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
        <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
        <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
      </div>
      <div className="p-8 flex items-center justify-center min-h-[220px] bg-gradient-to-br from-indigo-50 to-purple-50">
        <Content />
      </div>
    </div>
  );
};

// Reveals content as it scrolls into view. Triggers slightly before the element
// is actually visible (positive rootMargin) and only ever fires once, so it can't
// get stuck hidden or "flicker" on fast scrolls.
const useInView = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: '0px 0px 100px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
};

const Reveal = ({ children, delay = 0, className = '' }) => {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3.5'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-full bg-[#FDFBFF] font-sans text-slate-900">

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          <span className="font-black text-2xl tracking-tighter text-slate-900">
            Aura<span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Health</span>
          </span>

          <nav className="hidden md:flex items-center gap-9">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:w-0 after:bg-indigo-600 after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
              Sign In
            </button>
            <button
              onClick={() => navigate('/Userregister')}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white text-sm font-bold rounded-2xl shadow-lg shadow-purple-200 transition-all"
            >
              Get Started
            </button>
          </div>

          <button onClick={() => setMenuOpen((o) => !o)} className="md:hidden p-2.5 rounded-xl text-slate-500 hover:bg-slate-50">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden px-6 pb-6 flex flex-col gap-1 border-t border-slate-100">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="py-3 text-sm font-bold text-slate-600 hover:text-indigo-600">
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 mt-3">
              <button onClick={() => navigate('/login')} className="w-full py-3 text-sm font-bold text-slate-600 border border-slate-200 rounded-2xl">
                Sign In
              </button>
              <button onClick={() => navigate('/Userregister')} className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-purple-200">
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="motion-safe:animate-[floatSlow_9s_ease-in-out_infinite] absolute top-[-10%] left-[-5%] w-96 h-96 bg-purple-200/40 blur-[100px] rounded-full" />
        <div className="motion-safe:animate-[floatSlower_11s_ease-in-out_infinite] absolute top-[10%] right-[-5%] w-96 h-96 bg-blue-200/40 blur-[100px] rounded-full" />

        <div className="relative max-w-5xl mx-auto px-6 md:px-10 pt-20 pb-16 md:pt-28 md:pb-20 text-center">
        <div className="motion-safe:animate-[fadeInUp_0.6s_ease-out_both] inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-full shadow-sm mb-8">
          <Sparkles size={14} className="text-purple-600" />
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">AI-Assisted Healthcare Platform</span>
        </div>

        <h1
          className="motion-safe:animate-[fadeInUp_0.6s_ease-out_both] text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[1.1]"
          style={{ animationDelay: '70ms' }}
        >
          AuraHealth is the AI operating system for healthcare.
        </h1>
        <p
          className="motion-safe:animate-[fadeInUp_0.6s_ease-out_both] text-2xl md:text-3xl font-black tracking-tight bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mt-4"
          style={{ animationDelay: '140ms' }}
        >
          Give your clinic a pulse.
        </p>

        <p
          className="motion-safe:animate-[fadeInUp_0.6s_ease-out_both] text-slate-500 text-base md:text-lg max-w-2xl mx-auto mt-6 leading-relaxed"
          style={{ animationDelay: '210ms' }}
        >
          Book trusted doctors, consult over live video with AI-assisted analysis, and keep every
          report and message in one secure portal — built for patients and clinics alike.
        </p>

        <div
          className="motion-safe:animate-[fadeInUp_0.6s_ease-out_both] flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          style={{ animationDelay: '280ms' }}
        >
          <button
            onClick={() => navigate('/Userregister')}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-90 text-white font-bold rounded-2xl shadow-xl shadow-purple-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl active:scale-[0.98] inline-flex items-center justify-center gap-2"
          >
            Get Started Free <ArrowRight size={18} />
          </button>
          <button
            onClick={() => navigate('/Doctorregister')}
            className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 font-bold rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
          >
            Join as a Doctor
          </button>
        </div>

        <div
          className="motion-safe:animate-[fadeInUp_0.6s_ease-out_both] flex flex-wrap items-center justify-center gap-x-10 gap-y-3 mt-14"
          style={{ animationDelay: '350ms' }}
        >
          {HERO_POINTS.map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-slate-500">
              {icon}
              <span className="text-sm font-bold">{label}</span>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* The real problem */}
      <section className="bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-20 md:py-28">
          <Reveal>
            <p className="text-[11px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-3">The real problem</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter max-w-2xl">
              Healthcare today runs on missed calls and spreadsheets.
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-6 mt-14">
            {PROBLEMS.map((p, i) => (
              <Reveal key={p.issue} delay={i * 60}>
                <div className="bg-white border border-slate-100 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center mb-4">
                    <AlertCircle size={18} className="text-rose-500" />
                  </div>
                  <p className="font-bold text-slate-800">{p.issue}</p>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">{p.gap}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The shift */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 py-20 md:py-28">
        <Reveal>
          <p className="text-[11px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-3">The shift</p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter max-w-2xl">
            AuraHealth doesn&apos;t just store your data. It acts on it.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-10 mt-14">
          {SHIFT_STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 80} className="relative">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-5">
                {s.icon}
              </div>
              <span className="text-xs font-black text-indigo-400 tracking-widest">STEP {String(i + 1).padStart(2, '0')}</span>
              <h3 className="font-bold text-slate-800 tracking-tight text-xl mt-2 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.description}</p>
              {i < SHIFT_STEPS.length - 1 && (
                <ArrowRight size={18} className="hidden md:block text-indigo-200 absolute top-4 -right-8" />
              )}
            </Reveal>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 py-20 md:py-28">
          <Reveal className="text-center">
            <p className="text-[11px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-3">The difference</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">
              Traditional clinic software vs. AuraHealth
            </h2>
          </Reveal>

          <Reveal delay={80} className="mt-14 bg-white border border-slate-100 rounded-3xl shadow-xl shadow-indigo-500/5 overflow-x-auto">
            <div className="min-w-[560px]">
              <div className="grid grid-cols-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white text-sm font-bold">
                <div className="px-6 py-4 text-indigo-200">Category</div>
                <div className="px-6 py-4">Traditional</div>
                <div className="px-6 py-4">AuraHealth</div>
              </div>
              {COMPARISON.map((row, i) => (
                <div key={row.label} className={`grid grid-cols-3 text-sm ${i % 2 === 0 ? 'bg-white' : 'bg-indigo-50/30'}`}>
                  <div className="px-6 py-5 font-bold text-slate-800">{row.label}</div>
                  <div className="px-6 py-5 text-slate-400 flex items-start gap-2">
                    <Minus size={16} className="shrink-0 mt-0.5" /> {row.traditional}
                  </div>
                  <div className="px-6 py-5 text-slate-700 flex items-start gap-2">
                    <Check size={16} className="shrink-0 mt-0.5 text-indigo-600" /> {row.aura}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
      </section>

      {/* Feature showcase */}
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

      {/* How it works / Role-based benefits */}
      <section id="how-it-works" className="bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-20 md:py-28">
          <Reveal className="text-center">
            <p className="text-[11px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-3">Built for everyone</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">
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
        </div>
      </section>

      {/* About */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 py-20 md:py-28 text-center">
        <Reveal>
          <p className="text-[11px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-3">Why we built this</p>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter leading-snug">
            We built AuraHealth after watching patients wait days for a callback that should have taken minutes.
          </h2>
          <p className="text-slate-500 mt-5 leading-relaxed">
            Healthcare doesn&apos;t need more paperwork — it needs a system that responds as fast as care should.
            That&apos;s the entire premise behind AuraHealth.
          </p>
        </Reveal>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-20 md:py-28">
          <Reveal className="text-center">
            <p className="text-[11px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-3">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">
              Simple plans for patients &amp; clinics
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6 mt-14 items-start">
            {PLANS.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 80}>
                <div
                  className={`rounded-3xl p-8 transition-all duration-300 ${
                    plan.highlighted
                      ? 'bg-gradient-to-b from-purple-600 via-indigo-600 to-blue-600 text-white shadow-2xl shadow-purple-300/50 md:-translate-y-4'
                      : 'bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5'
                  }`}
                >
                  <h3 className={`font-bold text-lg tracking-tight ${plan.highlighted ? 'text-white' : 'text-slate-800'}`}>{plan.name}</h3>
                  <p className={`text-sm mt-2 ${plan.highlighted ? 'text-indigo-100' : 'text-slate-500'}`}>{plan.description}</p>

                  <div className="flex items-baseline gap-1 mt-6 mb-8">
                    <span className="text-4xl font-black tracking-tighter">{plan.price}</span>
                    {plan.period && <span className={`text-sm font-bold ${plan.highlighted ? 'text-indigo-100' : 'text-slate-400'}`}>{plan.period}</span>}
                  </div>

                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <Check size={18} className={`shrink-0 mt-0.5 ${plan.highlighted ? 'text-white' : 'text-indigo-600'}`} />
                        <span className={`text-sm ${plan.highlighted ? 'text-white/90' : 'text-slate-600'}`}>{f}</span>
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
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-6 md:px-10 py-20 md:py-28">
        <Reveal className="text-center mb-10">
          <p className="text-[11px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-3">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">
            Frequently asked questions
          </h2>
        </Reveal>

        <div>
          {FAQS.map((item, i) => (
            <Reveal key={item.q} delay={i * 50}>
              <FaqItem q={item.q} a={item.a} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28">
        <Reveal className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-[length:200%_200%] motion-safe:animate-[gradientX_8s_ease_infinite] px-8 py-16 md:py-20 text-center">
          <div className="motion-safe:animate-[floatSlow_10s_ease-in-out_infinite] absolute top-[-30%] left-[10%] w-72 h-72 bg-white/10 blur-[80px] rounded-full" />
          <div className="motion-safe:animate-[floatSlower_12s_ease-in-out_infinite] absolute bottom-[-30%] right-[10%] w-72 h-72 bg-white/10 blur-[80px] rounded-full" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter">
              Ready to give your clinic a pulse?
            </h2>
            <p className="text-indigo-100 mt-4 max-w-xl mx-auto">
              Join AuraHealth today and book your first appointment in minutes.
            </p>
            <button
              onClick={() => navigate('/Userregister')}
              className="mt-8 px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98] inline-flex items-center gap-2"
            >
              Create Your Free Account <ArrowRight size={18} />
            </button>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 grid sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <span className="font-black text-xl tracking-tighter text-slate-900">
              Aura<span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Health</span>
            </span>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">
              The AI operating system for modern healthcare.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Product</p>
            <ul className="space-y-3 text-sm">
              <li><a href="#features" className="text-slate-600 hover:text-indigo-600">Features</a></li>
              <li><a href="#pricing" className="text-slate-600 hover:text-indigo-600">Pricing</a></li>
              <li><a href="#faq" className="text-slate-600 hover:text-indigo-600">FAQ</a></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Get Started</p>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => navigate('/Userregister')} className="text-slate-600 hover:text-indigo-600">Patient Sign Up</button></li>
              <li><button onClick={() => navigate('/Doctorregister')} className="text-slate-600 hover:text-indigo-600">Doctor Sign Up</button></li>
              <li><button onClick={() => navigate('/login')} className="text-slate-600 hover:text-indigo-600">Sign In</button></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Company</p>
            <ul className="space-y-3 text-sm">
              <li><span className="text-slate-600">About</span></li>
              <li><span className="text-slate-600">Contact</span></li>
              <li><span className="text-slate-600">Privacy</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 text-sm text-slate-400 text-center">
            &copy; {new Date().getFullYear()} AuraHealth. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
