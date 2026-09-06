import React from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import HowItWorks from '../components/landing/HowItWorks';
import FeatureShowcase from '../components/landing/FeatureShowcase';
import Roles from '../components/landing/Roles';
import ComparisonTable from '../components/landing/ComparisonTable';
import Pricing from '../components/landing/Pricing';
import Resources from '../components/landing/Resources';
import About from '../components/landing/About';
import FAQ from '../components/landing/FAQ';
import CTA from '../components/landing/CTA';
import Contact from '../components/landing/Contact';
import Privacy from '../components/landing/Privacy';
import Footer from '../components/landing/Footer';
import Bot from '../components/bot';

const Landing = () => (
  <div className="w-full bg-white font-sans text-slate-900">
    <Navbar />
    <Hero />
    <HowItWorks />
    <FeatureShowcase />
    <Roles />
    <ComparisonTable />
    <Pricing />
    <Resources />
    <About />
    <FAQ />
    <Contact />
    <Privacy />
    <CTA />
    <Footer />
    <Bot />
  </div>
);

export default Landing;
