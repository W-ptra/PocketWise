import React from "react";
import Navbar from "./_components/Navbar";
import Hero from "./_components/Hero";
import Stats from "./_components/Stats";
import Features from "./_components/Features";
import Testimonials from "./_components/Testimonials";
import CTA from "./_components/CTA";
import Footer from "./_components/Footer";

function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}

export default LandingPage;
