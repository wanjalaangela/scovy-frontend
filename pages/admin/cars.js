import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../lib/api';
import Link from 'next/link';

export default function AdminCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = () => {
    api.get('/api/cars/')
      .then(res => setCars(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this car?')) return;
    setDeleting(id);
    try {
      await api.delete(`/api/cars/${id}/`);
      setCars(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert('Failed to delete car. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleFeatured = async (car) => {
    try {
      await api.patch(`/api/cars/${car.id}/`, { is_featured: !car.is_featured });
      setCars(prev => prev.map(c =>
        c.id === car.id ? { ...c, is_featured: !c.is_featured } : c
      ));
    } catch (err) {
      alert('Failed to update car.');
    }
  };

  const handleToggleAvailable = async (car) => {
    try {
      await api.patch(`/api/cars/${car.id}/`, { is_available: !car.is_available });
      setCars(prev => prev.map(c =>
        c.id === car.id ? { ...c, is_available: !c.is_available } : c
      ));
    } catch (err) {
      alert('Failed to update car.');
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0,
    }).format(price);

  const filtered = cars.filter(c =>
    `${c.make} ${c.model} ${c.year}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Cars Management">

      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search cars..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 pl-9"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        </div>
        <Link
          href="/admin/cars/new"
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-colors whitespace-nowrap"
        >
          + Add New Car
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
            <p className="text-4xl mb-3">🚗</p>
            <p className="text-gray-500 font-semibold">No cars found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Car</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Condition</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Available</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Featured</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(car => (
                  <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {car.images && car.images.length > 0 ? (
                            <img
                              src={car.images[0].image}
                              alt={car.make}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg opacity-30">🚗</div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[#0D0D3B]">{car.year} {car.make} {car.model}</p>
                          <p className="text-xs text-gray-400">{car.fuel_type} · {car.transmission}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#0D0D3B]">{formatPrice(car.price)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
                        car.condition === 'new'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {car.condition}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleAvailable(car)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${
                          car.is_available ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          car.is_available ? 'translate-x-5' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleFeatured(car)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${
                          car.is_featured ? 'bg-red-500' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          car.is_featured ? 'translate-x-5' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/cars/${car.id}/edit`}
                          className="text-xs font-bold px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(car.id)}
                          disabled={deleting === car.id}
                          className="text-xs font-bold px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        >
                          {deleting === car.id ? '...' : 'Delete'}
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

      {/* Count */}
      {!loading && (
        <p className="text-xs text-gray-400 mt-3">
          Showing {filtered.length} of {cars.length} cars
        </p>
      )}

    </AdminLayout>
  );
}