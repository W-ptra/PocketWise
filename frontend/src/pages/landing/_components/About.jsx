import React from "react";
import { FaLightbulb, FaUniversalAccess, FaGraduationCap, FaShieldAlt } from "react-icons/fa";

function About() {
  return (
    <section id="about" className="py-20 bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#00AB6B]/5 rounded-full -top-48 -left-48 animate-blob"></div>
        <div className="absolute w-96 h-96 bg-[#00AB6B]/5 rounded-full -bottom-48 -right-48 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto">
          {/* Header with animation */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-5xl font-bold mb-4 text-[#00AB6B] relative inline-block">
              About PocketWise
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#00AB6B] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A showcase project demonstrating the potential of AI-driven personal finance management.
            </p>
          </div>

          <div className="space-y-12">
            {/* Mission Section with hover effect */}
            <div className="bg-gradient-to-br from-white to-[#EAEAEA] p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-3xl font-semibold mb-6 text-[#00AB6B] flex items-center">
                <span className="bg-[#00AB6B] text-white p-3 rounded-full mr-4">
                  <FaLightbulb className="w-6 h-6" />
                </span>
                Project Vision
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                PocketWise is designed to demonstrate how AI technology could revolutionize personal finance management. This project explores the potential of making financial literacy and smart money management accessible to everyone through innovative technology.
              </p>
            </div>

            {/* Story Section with animation */}
            <div className="bg-gradient-to-br from-white to-[#EAEAEA] p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative">
                <h3 className="text-3xl font-semibold mb-6 text-[#00AB6B]">Project Overview</h3>
                <div className="prose prose-lg text-gray-700">
                  <p className="leading-relaxed text-lg">
                    Developed as part of a coding bootcamp project, PocketWise showcases the integration of modern web technologies with financial management concepts. It serves as a prototype for how AI could assist in personal financial planning and education.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white p-4 rounded-lg shadow">
                      <div className="text-3xl font-bold text-[#00AB6B]">4+</div>
                      <div className="text-gray-600">Key Features</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <div className="text-3xl font-bold text-[#00AB6B]">100%</div>
                      <div className="text-gray-600">Open Source</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Values Section with grid and icons */}
            <div className="bg-gradient-to-br from-white to-[#EAEAEA] p-8 rounded-2xl shadow-lg">
              <h3 className="text-3xl font-semibold mb-8 text-[#00AB6B] text-center">Project Goals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group hover:bg-white p-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="bg-[#00AB6B] p-3 rounded-lg text-white group-hover:scale-110 transition-transform duration-300">
                      <FaLightbulb className="w-6 h-6" />
                    </div>
                    <h4 className="font-semibold text-xl ml-4 text-[#00AB6B]">Innovation</h4>
                  </div>
                  <p className="text-gray-700">
                    Demonstrate innovative approaches to financial technology through modern web development.
                  </p>
                </div>

                <div className="group hover:bg-white p-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="bg-[#00AB6B] p-3 rounded-lg text-white group-hover:scale-110 transition-transform duration-300">
                      <FaUniversalAccess className="w-6 h-6" />
                    </div>
                    <h4 className="font-semibold text-xl ml-4 text-[#00AB6B]">Accessibility</h4>
                  </div>
                  <p className="text-gray-700">
                    Showcase user-friendly design principles that make financial tools approachable.
                  </p>
                </div>

                <div className="group hover:bg-white p-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="bg-[#00AB6B] p-3 rounded-lg text-white group-hover:scale-110 transition-transform duration-300">
                      <FaGraduationCap className="w-6 h-6" />
                    </div>
                    <h4 className="font-semibold text-xl ml-4 text-[#00AB6B]">Learning</h4>
                  </div>
                  <p className="text-gray-700">
                    Explore the integration of educational content within a financial management platform.
                  </p>
                </div>

                <div className="group hover:bg-white p-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="bg-[#00AB6B] p-3 rounded-lg text-white group-hover:scale-110 transition-transform duration-300">
                      <FaShieldAlt className="w-6 h-6" />
                    </div>
                    <h4 className="font-semibold text-xl ml-4 text-[#00AB6B]">Best Practices</h4>
                  </div>
                  <p className="text-gray-700">
                    Implement security best practices and modern development standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About; 