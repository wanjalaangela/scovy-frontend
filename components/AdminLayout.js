import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout({ children, title }) {
  const { isAuthenticated, logout, admin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/cars', label: 'Cars' },
    { href: '/admin/parts', label: 'Spare Parts' },
    { href: '/admin/orders', label: 'Orders' },
    { href: '/admin/preferences', label: 'Preferences' },
    { href: '/admin/bookings', label: 'Bookings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-[#0D0D3B] text-white flex flex-col fixed h-full z-40">
        <div className="p-6 border-b border-[#1A1A6E]">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-red-500 font-black text-lg">SCOVY</span>
            <span className="text-white font-light text-lg">IMPORTS</span>
          </div>
          <p className="text-xs text-gray-400">Admin Dashboard</p>
          <Link
            href="/"
            className="mt-3 flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to website
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                router.pathname === item.href
                  ? 'bg-red-600 text-white'
                  : 'text-gray-300 hover:bg-[#1A1A6E] hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[#1A1A6E]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-xs font-black">
              {admin?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-semibold text-white">{admin?.username}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); router.push('/admin/login'); }}
            className="w-full text-xs text-gray-400 hover:text-red-400 transition-colors text-left px-1"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 ml-64">
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-30">
          <h1 className="text-lg font-black text-[#0D0D3B]">{title}</h1>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}