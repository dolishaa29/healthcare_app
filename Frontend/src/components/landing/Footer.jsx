import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Heart } from 'lucide-react';

const XIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.754-1.333-1.754-1.089-.744.083-.729.083-.729 1.205.084 1.838 1.238 1.838 1.238 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.303-5.466-1.334-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.5 11.5 0 0 1 3-.405c1.02.005 2.045.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const Footer = () => {
  const navigate = useNavigate();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter logic here
  };

  return (
    <footer className="bg-slate-900 text-slate-300 relative overflow-hidden">
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Brand & Newsletter Column (Spans 5 cols on large screens) */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              {/* Brand Logo */}
              <a href="#" className="inline-block mb-4">
                <span className="font-bold text-2xl tracking-tight text-white">
                  Aura<span className="text-indigo-400">Health</span>
                </span>
              </a>

              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                The AI operating system for modern healthcare. Streamlining patient diagnostics and practice management in one intuitive ecosystem.
              </p>
            </div>

            {/* Newsletter Subscription */}
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
                Subscribe to updates
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2 max-w-sm">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 active:scale-95"
                >
                  <span>Join</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Links Columns (Spans 7 cols on large screens) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 pt-2">
            
            {/* Product Links */}
            <div>
              <p className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
                Product
              </p>
              <ul className="space-y-3 text-sm">
                {['Features', 'How It Works', 'Pricing', 'FAQ'].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-slate-400 hover:text-white transition-colors duration-200 inline-block"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
                Get Started
              </p>
              <ul className="space-y-3 text-sm">
                <li>
                  <button
                    onClick={() => navigate('/Userregister')}
                    className="text-slate-400 hover:text-indigo-400 transition-colors text-left"
                  >
                    Patient Portal
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/Doctorregister')}
                    className="text-slate-400 hover:text-indigo-400 transition-colors text-left flex items-center gap-1.5"
                  >
                    <span>Doctor Portal</span>
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md">
                      PRO
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/login')}
                    className="text-slate-400 hover:text-indigo-400 transition-colors text-left"
                  >
                    Account Sign In
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
                Company
              </p>
              <ul className="space-y-3 text-sm">
                {[
                  { label: 'Contact Support', href: '#contact' },
                ].map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-slate-400 hover:text-white transition-colors duration-200 inline-block"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="mt-16 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <span>&copy; {new Date().getFullYear()} AuraHealth Inc. Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline mx-0.5" />
            <span>for better healthcare.</span>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4 text-slate-400">
            <a href="#" className="p-2 hover:bg-slate-800 hover:text-white rounded-lg transition-colors" aria-label="X (Twitter)">
              <XIcon className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 hover:bg-slate-800 hover:text-white rounded-lg transition-colors" aria-label="GitHub">
              <GithubIcon className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 hover:bg-slate-800 hover:text-white rounded-lg transition-colors" aria-label="LinkedIn">
              <LinkedinIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;