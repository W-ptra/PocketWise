import React from "react";

function Stats() {
  return (
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
  );
}

export default Stats; 