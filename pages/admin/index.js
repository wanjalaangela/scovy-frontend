import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../lib/api';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    cars: 0,
    parts: 0,
    orders: 0,
    preferences: 0,
    bookings: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentPreferences, setRecentPreferences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/cars/'),
      api.get('/api/parts/'),
      api.get('/api/orders/'),
      api.get('/api/preferences/'),
      api.get('/api/consultations/bookings/'),
    ]).then(([cars, parts, orders, prefs, bookings]) => {
      const allOrders = orders.data;
      setStats({
        cars: cars.data.length,
        parts: parts.data.length,
        orders: allOrders.length,
        preferences: prefs.data.length,
        bookings: bookings.data.length,
        pendingOrders: allOrders.filter(o => o.payment_status === 'pending').length,
      });
      setRecentOrders(allOrders.slice(0, 5));
      setRecentPreferences(prefs.data.slice(0, 5));
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0,
    }).format(price);

  const statCards = [
    { label: 'Cars Listed', value: stats.cars, href: '/admin/cars', color: 'border-l-blue-500' },
    { label: 'Spare Parts', value: stats.parts, href: '/admin/parts', color: 'border-l-purple-500' },
    { label: 'Total Orders', value: stats.orders, href: '/admin/orders', color: 'border-l-green-500' },
    { label: 'Pending Orders', value: stats.pendingOrders, href: '/admin/orders', color: 'border-l-yellow-500' },
    { label: 'Preferences', value: stats.preferences, href: '/admin/preferences', color: 'border-l-red-500' },
    { label: 'Bookings', value: stats.bookings, href: '/admin/bookings', color: 'border-l-orange-500' },
  ];

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-8">
            {statCards.map(card => (
              <Link
                key={card.label}
                href={card.href}
                className={`bg-white rounded-xl p-6 border border-gray-200 border-l-4 ${card.color} hover:shadow-md transition-shadow`}
              >
                <div className="text-3xl font-black text-[#0D0D3B] mb-1">{card.value}</div>
                <div className="text-sm text-gray-500 font-medium">{card.label}</div>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-black text-[#0D0D3B] text-sm">Recent Orders</h2>
                <Link href="/admin/orders" className="text-xs text-red-600 font-semibold hover:underline">
                  View all
                </Link>
              </div>
              <div className="divide-y divide-gray-50">
                {recentOrders.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-8">No orders yet</p>
                ) : (
                  recentOrders.map(order => (
                    <div key={order.id} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-[#0D0D3B] font-mono">{order.order_number}</p>
                        <p className="text-xs text-gray-400">{order.customer_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[#0D0D3B]">{formatPrice(order.total_amount)}</p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          order.payment_status === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : order.payment_status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {order.payment_status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-black text-[#0D0D3B] text-sm">Recent Preferences</h2>
                <Link href="/admin/preferences" className="text-xs text-red-600 font-semibold hover:underline">
                  View all
                </Link>
              </div>
              <div className="divide-y divide-gray-50">
                {recentPreferences.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-8">No preferences yet</p>
                ) : (
                  recentPreferences.map(pref => (
                    <div key={pref.id} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-[#0D0D3B]">{pref.full_name}</p>
                        <p className="text-xs text-gray-400">
                          {pref.preferred_make} {pref.preferred_model}
                        </p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        pref.is_contacted
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {pref.is_contacted ? 'Contacted' : 'New'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}