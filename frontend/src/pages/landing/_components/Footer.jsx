import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#EAEAEA] py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-[#00AB6B] font-bold text-xl mb-4 md:mb-0">
            PocketWise
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-[#00AB6B] transition-colors">About</a>
            <a href="#" className="text-gray-600 hover:text-[#00AB6B] transition-colors">Features</a>
            <a href="#" className="text-gray-600 hover:text-[#00AB6B] transition-colors">Contact</a>
            <Link to="/privacy" className="text-gray-600 hover:text-[#00AB6B] transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 