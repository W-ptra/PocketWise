function Navbar() {
  return (
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
            <a href="/login">
              <button className="text-[#00AB6B] hover:text-[#009B5E] font-semibold transition-colors cursor-pointer">
                Login
              </button>
            </a>
            <a href="/register">
              <button className="bg-[#00AB6B] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#009B5E] transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
                Join Us
              </button>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
