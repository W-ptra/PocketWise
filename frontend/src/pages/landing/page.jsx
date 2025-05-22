import React from "react";
import Navbar from "./_components/Navbar";
import Hero from "./_components/Hero";
import About from "./_components/About";
import Features from "./_components/Features";
import Testimonials from "./_components/Testimonials";
import CTA from "./_components/CTA";
import Footer from "./_components/Footer";

function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />
      <Hero />
      <About />
      <Features />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}

export default LandingPage;
