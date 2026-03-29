import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../lib/api';

export default function AdminPreferences() {
  const [preferences, setPreferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/api/preferences/')
      .then(res => setPreferences(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkContacted = async (pref) => {
    try {
      await api.patch(`/api/preferences/${pref.id}/`, { is_contacted: !pref.is_contacted });
      setPreferences(prev =>
        prev.map(p => p.id === pref.id ? { ...p, is_contacted: !p.is_contacted } : p)
      );
    } catch (err) {
      alert('Failed to update preference.');
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'Not specified';
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-KE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const filtered = preferences.filter(p => {
    const matchesFilter = filter === 'contacted'
      ? p.is_contacted
      : filter === 'new'
      ? !p.is_contacted
      : true;
    const matchesSearch = search
      ? `${p.full_name} ${p.phone} ${p.preferred_make} ${p.preferred_model}`.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesFilter && matchesSearch;
  });

  return (
    <AdminLayout title="Customer Preferences">

      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search preferences..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 pl-9"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          </div>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 bg-white text-gray-700"
          >
            <option value="">All</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
          </select>
        </div>
        <div className="flex gap-3 text-sm">
          <div className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-xl font-bold">
            New: {preferences.filter(p => !p.is_contacted).length}
          </div>
          <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl font-bold">
            Contacted: {preferences.filter(p => p.is_contacted).length}
          </div>
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-4xl mb-3">❤️</p>
          <p className="text-gray-500 font-semibold">No preferences found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(pref => (
            <div
              key={pref.id}
              className={`bg-white rounded-xl border p-5 transition-all ${
                pref.is_contacted ? 'border-green-200' : 'border-yellow-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-black text-[#0D0D3B]">{pref.full_name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{pref.phone} · {pref.email}</p>
                </div>
                <button
                  onClick={() => handleMarkContacted(pref)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                    pref.is_contacted
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  }`}
                >
                  {pref.is_contacted ? '✓ Contacted' : 'Mark Contacted'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {pref.preferred_make && (
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-gray-400 mb-0.5">Make</p>
                    <p className="font-bold text-[#0D0D3B]">{pref.preferred_make}</p>
                  </div>
                )}
                {pref.preferred_model && (
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-gray-400 mb-0.5">Model</p>
                    <p className="font-bold text-[#0D0D3B]">{pref.preferred_model}</p>
                  </div>
                )}
                {(pref.budget_min || pref.budget_max) && (
                  <div className="bg-gray-50 rounded-lg p-2 col-span-2">
                    <p className="text-gray-400 mb-0.5">Budget</p>
                    <p className="font-bold text-[#0D0D3B]">
                      {formatPrice(pref.budget_min)} — {formatPrice(pref.budget_max)}
                    </p>
                  </div>
                )}
                {pref.fuel_type && pref.fuel_type !== 'any' && (
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-gray-400 mb-0.5">Fuel</p>
                    <p className="font-bold text-[#0D0D3B] capitalize">{pref.fuel_type}</p>
                  </div>
                )}
                {pref.transmission && pref.transmission !== 'any' && (
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-gray-400 mb-0.5">Transmission</p>
                    <p className="font-bold text-[#0D0D3B] capitalize">{pref.transmission}</p>
                  </div>
                )}
              </div>

              {pref.notes && (
                <div className="mt-3 bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 leading-relaxed">{pref.notes}</p>
                </div>
              )}

              <p className="text-xs text-gray-400 mt-3">{formatDate(pref.created_at)}</p>
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <p className="text-xs text-gray-400 mt-3">
          Showing {filtered.length} of {preferences.length} preferences
        </p>
      )}

    </AdminLayout>
  );
}