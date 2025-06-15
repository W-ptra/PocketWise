import React from "react";
import landingImage from "../../../assets/landing-image.png";

function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-[#00AB6B] to-[#008B57] py-20 md:py-32 mt-16 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute w-[500px] h-[500px] bg-white/10 rounded-full -top-40 -left-40 animate-blob opacity-70"></div>
        <div className="absolute w-[500px] h-[500px] bg-white/10 rounded-full top-40 -right-40 animate-blob animation-delay-2000 opacity-70"></div>
        <div className="absolute w-[300px] h-[300px] bg-white/10 rounded-full bottom-20 left-1/2 transform -translate-x-1/2 animate-blob animation-delay-4000 opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 text-white mb-8 md:mb-0">
            <div className="space-y-8 transform transition-all">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="inline-block animate-fade-in-up">Smart Finance,</span>
                <br />
                <span className="text-[#EAEAEA] inline-block animate-fade-in-up animation-delay-200">
                  Brighter Future
                </span>
              </h1>
              <p className="text-lg md:text-xl opacity-90 animate-fade-in-up animation-delay-400 max-w-xl">
                Achieve your financial freedom with AI-powered personal financial advice for a brighter future.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-up animation-delay-600">
                <a href="/login">
                  <button className="bg-white text-[#00AB6B] px-8 py-3.5 rounded-full font-semibold hover:bg-[#EAEAEA] transition-all duration-300 hover:scale-105 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer">
                    Get Started
                  </button>
                </a>
                <a href="/login">
                  <button className="border-2 border-white text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                    Watch Demo
                  </button>
                </a>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="relative animate-float">
              <img
                src={landingImage}
                alt="Financial Planning Illustration"
                className="w-full max-w-lg mx-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#00AB6B]/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero; 