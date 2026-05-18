const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-100">
      <div className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4 sm:grid-cols-2">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-semibold text-white">VendorVerse</h3>
            <p className="mt-2 text-sm text-slate-400">Empowering local businesses digitally.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-white transition">Home</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition">Browse</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition">Vendors</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white">Support</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-white transition">Help Center</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition">Contact Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition">FAQ</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-white transition">Privacy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition">Terms</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition">Cookies</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 border-t border-slate-700 pt-8 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-slate-400">&copy; 2026 VendorVerse. All rights reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <a href="#" className="text-slate-400 hover:text-white transition">Twitter</a>
            <a href="#" className="text-slate-400 hover:text-white transition">Facebook</a>
            <a href="#" className="text-slate-400 hover:text-white transition">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
