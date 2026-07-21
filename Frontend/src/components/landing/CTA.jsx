import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal from './Reveal';

const CTA = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default CTA;
