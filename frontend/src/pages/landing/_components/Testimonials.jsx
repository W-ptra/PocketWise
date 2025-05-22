import React from "react";

function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#00AB6B]">
          What Our Users Say
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">
          Join thousands of satisfied users who have transformed their financial journey with PocketWise. Here's what they have to say about their experience.
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
              "PocketWise has completely transformed how I manage my business finances. The AI recommendations are spot-on!"
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
              "As a student, budgeting was always a challenge. PocketWise made it simple and actually fun!"
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
              "The educational content is fantastic. I've learned so much about investing and saving for retirement."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials; 