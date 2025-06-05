function Footer() {
  return (
    <footer className="bg-[#00AB6B]">
      <div className="mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center justify-between">
          <p className="text-white font-semibold text-sm">
            © {new Date().getFullYear()} PocketWise. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-white/80 hover:text-white text-sm transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-white/80 hover:text-white text-sm transition-colors duration-200"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
