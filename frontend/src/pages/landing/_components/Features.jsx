import React from "react";
import { FaChartLine, FaBookReader } from "react-icons/fa";
import { BsFillPersonLinesFill } from "react-icons/bs";

function Features() {
  return (
    <section className="py-16 bg-gradient-to-b from-[#EAEAEA] to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#00AB6B]">
          Our Key Features
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">
          Discover how our AI-powered platform combines cutting-edge technology with financial expertise to help you achieve your financial goals.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-[#00AB6B] rounded-2xl flex items-center justify-center mb-6 mx-auto rotate-3">
              <BsFillPersonLinesFill className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-4">Personal Financial Advice</h3>
            <p className="text-gray-600 text-center">
              Get personalized financial recommendations tailored to your profile and goals.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-[#00AB6B] rounded-2xl flex items-center justify-center mb-6 mx-auto -rotate-3">
              <FaChartLine className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-4">Financial Analysis</h3>
            <p className="text-gray-600 text-center">
              Monitor and analyze your expenses with AI assistance for better decision-making.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-[#00AB6B] rounded-2xl flex items-center justify-center mb-6 mx-auto rotate-3">
              <FaBookReader className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-4">Financial Education</h3>
            <p className="text-gray-600 text-center">
              Enhance your financial literacy through interactive and easy-to-understand content.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features; 