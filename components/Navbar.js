import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useCart();

  return (
    <nav className="bg-white text-gray-900 sticky top-0 z-50 shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.jpg"
              alt="Scovy Imports"
              width={120}
              height={48}
              className="object-contain h-10 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { href: '/cars', label: 'CARS' },
              { href: '/parts', label: 'SPARE PARTS' },
              { href: '/consultations', label: 'CONSULTATIONS' },
              { href: '/preferences', label: 'FIND MY CAR' },
              { href: '/contact', label: 'CONTACT' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-red-600 text-xs font-semibold tracking-widest transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* Cart Icon */}
            <Link href="/cart" className="relative">
              <div className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-xs font-black rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

            <Link
              href="/cars"
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 text-xs font-bold tracking-widest transition-colors rounded"
            >
              VIEW STOCK
            </Link>
          </div>

          {/* Mobile right side */}
          <div className="md:hidden flex items-center gap-3">
            {/* Mobile Cart */}
            <Link href="/cart" className="relative">
              <div className="w-9 h-9 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-xs font-black rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

            {/* Hamburger */}
            <button
              className="text-gray-600 hover:text-gray-900 p-1"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="space-y-1.5 w-6">
                <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
          {[
            { href: '/cars', label: 'CARS' },
            { href: '/parts', label: 'SPARE PARTS' },
            { href: '/consultations', label: 'CONSULTATIONS' },
            { href: '/preferences', label: 'FIND MY CAR' },
            { href: '/contact', label: 'CONTACT' },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-gray-600 hover:text-red-600 text-xs font-semibold tracking-widest py-3 border-b border-gray-100 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/cars"
            className="block bg-red-600 text-white text-center px-4 py-3 text-xs font-bold tracking-widest rounded mt-2"
          >
            VIEW STOCK
          </Link>
        </div>
      )}
    </nav>
  );
}