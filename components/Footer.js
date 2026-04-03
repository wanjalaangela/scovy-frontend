import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0D0D3B] text-gray-400 mt-20 border-t-4 border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-red-600 font-black text-2xl tracking-tight">SCOVI</span>
              <span className="text-white font-light text-2xl tracking-widest">IMPORTS</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500 max-w-sm">
              Kenya&apos;s trusted source for premium imported vehicles and genuine
              spare parts. Quality, transparency, and service you can count on.
            </p>
            <div className="flex gap-3 mt-6">
              <a href="#" className="w-9 h-9 rounded-full bg-[#12124F] hover:bg-red-600 border border-[#1A1A6E] flex items-center justify-center transition-colors text-xs font-bold">f</a>
              <a href="#" className="w-9 h-9 rounded-full bg-[#12124F] hover:bg-red-600 border border-[#1A1A6E] flex items-center justify-center transition-colors text-xs font-bold">in</a>
              <a href="#" className="w-9 h-9 rounded-full bg-[#12124F] hover:bg-red-600 border border-[#1A1A6E] flex items-center justify-center transition-colors text-xs font-bold">tw</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-widest mb-5 border-b-2 border-red-600 pb-2 inline-block">
              QUICK LINKS
            </h4>
            <ul className="space-y-3 text-sm mt-3">
              <li><Link href="/cars" className="hover:text-red-400 transition-colors flex items-center gap-2"><span className="text-red-500">›</span>Browse Cars</Link></li>
              <li><Link href="/parts" className="hover:text-red-400 transition-colors flex items-center gap-2"><span className="text-red-500">›</span>Spare Parts</Link></li>
              <li><Link href="/consultations" className="hover:text-red-400 transition-colors flex items-center gap-2"><span className="text-red-500">›</span>Book Consultation</Link></li>
              <li><Link href="/preferences" className="hover:text-red-400 transition-colors flex items-center gap-2"><span className="text-red-500">›</span>Find My Car</Link></li>
              <li><Link href="/contact" className="hover:text-red-400 transition-colors flex items-center gap-2"><span className="text-red-500">›</span>Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-widest mb-5 border-b-2 border-red-600 pb-2 inline-block">
              CONTACT
            </h4>
            <ul className="space-y-3 text-sm mt-3">
              <li className="flex items-start gap-3"><span className="text-red-500">📍</span><span>Mombasa, Kenya</span></li>
              <li className="flex items-start gap-3"><span className="text-red-500">📞</span><span>+254 715 277 636</span></li>
              <li className="flex items-start gap-3"><span className="text-red-500">✉️</span><span>importsscovi@gmail.com</span></li>
              <li className="flex items-start gap-3"><span className="text-red-500">🕐</span><span>Mon–Sat: 8am – 6pm</span></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-[#1A1A6E] mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} Scovy Imports. All rights reserved.</p>
          <p>Mombasa, Kenya</p>
        </div>

      </div>
    </footer>
  );
}