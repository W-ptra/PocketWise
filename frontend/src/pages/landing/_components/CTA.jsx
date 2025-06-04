import React from "react";

function CTA() {
  return (
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
            Join thousands of users who have improved their financial health with PocketWise.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a href="/register">
              <button className="bg-white text-[#00AB6B] px-8 py-3 rounded-full font-semibold hover:bg-[#EAEAEA] transition-all duration-300 hover:scale-105 hover:shadow-lg w-full sm:w-auto cursor-pointer">
                Sign Up Free
              </button>
            </a>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 w-full sm:w-auto">
              Schedule a Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA; 