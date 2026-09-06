import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal from './Reveal';

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28">
      <Reveal className="relative overflow-hidden rounded-3xl bg-indigo-600 px-8 py-16 md:py-20 text-center">
        <div className="relative">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Ready to skip the waiting room?
          </h2>
          <p className="text-indigo-100 mt-4 max-w-xl mx-auto">
            Join AuraHealth today and book your first appointment in minutes.
          </p>
          <button
            onClick={() => navigate('/Userregister')}
            className="mt-8 px-8 py-4 bg-white text-indigo-600 font-semibold rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] inline-flex items-center gap-2"
          >
            Create Your Free Account <ArrowRight size={18} />
          </button>
        </div>
      </Reveal>
    </section>
  );
};

export default CTA;
