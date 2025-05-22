import React from "react";
import landingImage from "../../../assets/landing-image.svg";

function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-[#00AB6B] to-[#008B57] py-20 md:py-32 mt-16">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-white/10 rounded-full -top-20 -left-20 animate-blob"></div>
        <div className="absolute w-96 h-96 bg-white/10 rounded-full top-40 -right-20 animate-blob animation-delay-2000"></div>
      </div>
      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 text-white mb-8 md:mb-0">
            <div className="space-y-6 transform transition-all">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight animate-fade-in-up">
                Smart Finance,<br />
                <span className="text-[#EAEAEA]">Brighter Future</span>
              </h1>
              <p className="text-lg md:text-xl opacity-90 animate-fade-in-up animation-delay-300">
                Achieve your financial freedom with AI-powered personal financial advice for a brighter future.
              </p>
              <div className="flex space-x-4 animate-fade-in-up animation-delay-600">
                <button className="bg-white text-[#00AB6B] px-8 py-3 rounded-full font-semibold hover:bg-[#EAEAEA] transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  Get Started
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all duration-300">
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 relative animate-float">
            <img
              src={landingImage}
              alt="Financial Planning Illustration"
              className="w-full max-w-lg mx-auto drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero; 