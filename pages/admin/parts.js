import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../lib/api';
import Link from 'next/link';

export default function AdminParts() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = () => {
    api.get('/api/parts/')
      .then(res => setParts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this part?')) return;
    setDeleting(id);
    try {
      await api.delete(`/api/parts/${id}/`);
      setParts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete part. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleActive = async (part) => {
    try {
      await api.patch(`/api/parts/${part.id}/`, { is_active: !part.is_active });
      setParts(prev => prev.map(p =>
        p.id === part.id ? { ...p, is_active: !p.is_active } : p
      ));
    } catch (err) {
      alert('Failed to update part.');
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0,
    }).format(price);

  const categories = ['engine', 'brakes', 'suspension', 'filters', 'accessories', 'other'];

  const filtered = parts.filter(p => {
    const matchesSearch = `${p.name} ${p.compatible_makes} ${p.part_number}`.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout title="Spare Parts Management">

      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search parts..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 pl-9"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          </div>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 bg-white text-gray-700"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat} className="capitalize">{cat}</option>
            ))}
          </select>
        </div>
        <Link
          href="/admin/parts/new"
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-colors whitespace-nowrap"
        >
          + Add New Part
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔩</p>
            <p className="text-gray-500 font-semibold">No parts found</p>
            <Link
              href="/admin/parts/new"
              className="inline-block mt-4 bg-red-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold"
            >
              Add First Part
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Part</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Active</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(part => (
                  <tr key={part.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {part.images && part.images.length > 0 ? (
                            <img
                              src={part.images[0].image}
                              alt={part.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg opacity-30">🔩</div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[#0D0D3B]">{part.name}</p>
                          {part.compatible_makes && (
                            <p className="text-xs text-gray-400">Fits: {part.compatible_makes}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 capitalize">
                        {part.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#0D0D3B]">
                      {formatPrice(part.price)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        part.stock_quantity > 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {part.stock_quantity > 0 ? `${part.stock_quantity} in stock` : 'Out of stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(part)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${
                          part.is_active ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          part.is_active ? 'translate-x-5' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/parts/${part.id}/edit`}
                          className="text-xs font-bold px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(part.id)}
                          disabled={deleting === part.id}
                          className="text-xs font-bold px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        >
                          {deleting === part.id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && (
        <p className="text-xs text-gray-400 mt-3">
          Showing {filtered.length} of {parts.length} parts
        </p>
      )}

    </AdminLayout>
  );
}