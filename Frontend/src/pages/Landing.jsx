import React from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import HowItWorks from '../components/landing/HowItWorks';
import FeatureShowcase from '../components/landing/FeatureShowcase';
import Roles from '../components/landing/Roles';
import Pricing from '../components/landing/Pricing';
import Resources from '../components/landing/Resources';
import FAQ from '../components/landing/FAQ';
import Contact from '../components/landing/Contact';
import Footer from '../components/landing/Footer';
import Bot from '../components/bot';

const Landing = () => (
  <div className="w-full bg-slate-50 font-sans text-slate-900">
    <Navbar />
    <Hero />
    <HowItWorks />
    <FeatureShowcase />
    <Roles />
    <Pricing />
    <Resources />
    <FAQ />
    <Contact />
    <Footer />
    <Bot />
  </div>
);

export default Landing;
