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
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Mombasa, Kenya</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+254 715 277 636</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>importsscovi@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Mon–Sat: 8am – 6pm</span>
              </li>
            </ul>
          </div>

        </div> {/* ✅ closes grid */}

        <div className="border-t border-[#1A1A6E] mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} Scovy Imports. All rights reserved.</p>
          <p>Mombasa, Kenya</p>
        </div>

      </div>
    </footer>
  );
}