import React from "react";
import landingImage from "../assets/landing-image.svg";
import { FaChartLine, FaBookReader } from "react-icons/fa";
import { BsFillPersonLinesFill } from "react-icons/bs";

function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-md py-4 fixed w-full top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <a href="/">
              <div className="flex items-center">
                <img
                  src="/logo/pocket-wise-logo.jpg"
                  alt="PocketWise Logo"
                  className="w-12 h-12 rounded-md mr-2"
                />
                <h1 className="text-2xl font-bold text-[#00AB6B] hover:scale-105 transition-transform cursor-pointer">
                  PocketWise
                </h1>
              </div>
            </a>

            <div className="flex items-center space-x-4">
              <button className="text-[#00AB6B] hover:text-[#009B5E] font-semibold transition-colors">
                Login
              </button>
              <button className="bg-[#00AB6B] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#009B5E] transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Join Us
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Animated Background */}
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
                  Smart Finance,
                  <br />
                  <span className="text-[#EAEAEA]">Brighter Future</span>
                </h1>
                <p className="text-lg md:text-xl opacity-90 animate-fade-in-up animation-delay-300">
                  Achieve your financial freedom with AI-powered personal
                  financial advice for a brighter future.
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

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 hover:transform hover:scale-105 transition-transform">
              <div className="text-4xl font-bold text-[#00AB6B] mb-2">50K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="text-center p-6 hover:transform hover:scale-105 transition-transform">
              <div className="text-4xl font-bold text-[#00AB6B] mb-2">$2M+</div>
              <div className="text-gray-600">Money Managed</div>
            </div>
            <div className="text-center p-6 hover:transform hover:scale-105 transition-transform">
              <div className="text-4xl font-bold text-[#00AB6B] mb-2">95%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Cards */}
      <section className="py-16 bg-gradient-to-b from-[#EAEAEA] to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#00AB6B]">
            Our Key Features
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">
            Discover how our AI-powered platform combines cutting-edge
            technology with financial expertise to help you achieve your
            financial goals.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-[#00AB6B] rounded-2xl flex items-center justify-center mb-6 mx-auto rotate-3">
                <BsFillPersonLinesFill className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-4">
                Personal Financial Advice
              </h3>
              <p className="text-gray-600 text-center">
                Get personalized financial recommendations tailored to your
                profile and goals.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-[#00AB6B] rounded-2xl flex items-center justify-center mb-6 mx-auto -rotate-3">
                <FaChartLine className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-4">
                Financial Analysis
              </h3>
              <p className="text-gray-600 text-center">
                Monitor and analyze your expenses with AI assistance for better
                decision-making.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-[#00AB6B] rounded-2xl flex items-center justify-center mb-6 mx-auto rotate-3">
                <FaBookReader className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-4">
                Financial Education
              </h3>
              <p className="text-gray-600 text-center">
                Enhance your financial literacy through interactive and
                easy-to-understand content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#00AB6B]">
            What Our Users Say
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">
            Join thousands of satisfied users who have transformed their
            financial journey with PocketWise. Here's what they have to say
            about their experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-[#EAEAEA] p-6 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#00AB6B] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  S
                </div>
                <div className="ml-4">
                  <div className="font-semibold">Sarah Johnson</div>
                  <div className="text-sm text-gray-600">Entrepreneur</div>
                </div>
              </div>
              <p className="text-gray-700">
                "PocketWise has completely transformed how I manage my business
                finances. The AI recommendations are spot-on!"
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-[#EAEAEA] p-6 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#00AB6B] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  M
                </div>
                <div className="ml-4">
                  <div className="font-semibold">Michael Chen</div>
                  <div className="text-sm text-gray-600">Student</div>
                </div>
              </div>
              <p className="text-gray-700">
                "As a student, budgeting was always a challenge. PocketWise made
                it simple and actually fun!"
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-[#EAEAEA] p-6 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#00AB6B] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  R
                </div>
                <div className="ml-4">
                  <div className="font-semibold">Rachel Smith</div>
                  <div className="text-sm text-gray-600">Professional</div>
                </div>
              </div>
              <p className="text-gray-700">
                "The educational content is fantastic. I've learned so much
                about investing and saving for retirement."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#00AB6B] to-[#008B57] text-white">
        <div className="container mx-auto px-4 text-center relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-96 h-96 bg-white/5 rounded-full -top-48 -left-48"></div>
            <div className="absolute w-96 h-96 bg-white/5 rounded-full -bottom-48 -right-48"></div>
          </div>
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Finances?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have improved their financial health
              with PocketWise.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-white text-[#00AB6B] px-8 py-3 rounded-full font-semibold hover:bg-[#EAEAEA] transition-all duration-300 hover:scale-105 hover:shadow-lg w-full sm:w-auto">
                Sign Up Free
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 w-full sm:w-auto">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#EAEAEA] py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-[#00AB6B] font-bold text-xl mb-4 md:mb-0">
              PocketWise
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-600 hover:text-[#00AB6B] transition-colors"
              >
                About
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-[#00AB6B] transition-colors"
              >
                Features
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-[#00AB6B] transition-colors"
              >
                Contact
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-[#00AB6B] transition-colors"
              >
                Privacy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
