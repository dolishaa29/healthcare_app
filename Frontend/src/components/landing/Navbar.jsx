import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';

const NAV_LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Product', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#about' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
  { label: 'Privacy', href: '#privacy' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/70 backdrop-blur-md border-b border-white/20 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] py-3'
          : 'bg-transparent border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <span className="font-black text-2xl tracking-tight text-slate-900 transition-opacity group-hover:opacity-90">
            Aura
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Health
            </span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/5 p-1.5 rounded-full border border-slate-900/5 backdrop-blur-sm">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-full hover:bg-white/80 transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/Userregister')}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white text-sm font-semibold rounded-full shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100/80 transition-colors"
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pt-4 pb-6 mt-3 bg-white/90 backdrop-blur-xl border-t border-slate-200/60 shadow-xl flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2.5 text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-50/80 rounded-lg transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="h-px bg-slate-100 my-2" />
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate('/login');
              }}
              className="w-full py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100/80 border border-slate-200 rounded-xl transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate('/Userregister');
              }}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-500/20 active:scale-[0.98] transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;