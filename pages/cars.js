import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../lib/api';

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    make: '',
    fuel_type: '',
    transmission: '',
    condition: '',
  });

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (filters.make) params.append('make', filters.make);
    if (filters.fuel_type) params.append('fuel_type', filters.fuel_type);
    if (filters.transmission) params.append('transmission', filters.transmission);
    if (filters.condition) params.append('condition', filters.condition);

    api.get(`/api/cars/?${params.toString()}`)
      .then(res => setCars(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [search, filters]);

  const handleFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ make: '', fuel_type: '', transmission: '', condition: '' });
    setSearch('');
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== '').length;

  return (
    <div className="min-h-screen bg-white">

      {/* PAGE HEADER */}
      <div className="bg-[#0D0D3B] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-red-500 text-xs font-bold tracking-widest uppercase mb-2">Our Inventory</p>
          <h1 className="text-4xl font-black">Browse Our Cars</h1>
          <p className="text-gray-400 mt-2">
            {loading ? 'Loading...' : `${cars.length} vehicle${cars.length !== 1 ? 's' : ''} available`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* SIDEBAR FILTERS */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-[#0D0D3B] text-sm tracking-wide">FILTERS</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold"
                  >
                    Clear all ({activeFiltersCount})
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="text-xs font-bold text-gray-500 tracking-wider uppercase block mb-2">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="e.g. Toyota, Prado..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-400 text-gray-700"
                />
              </div>

              {/* Make */}
              <div className="mb-6">
                <label className="text-xs font-bold text-gray-500 tracking-wider uppercase block mb-2">
                  Make
                </label>
                <select
                  value={filters.make}
                  onChange={e => handleFilter('make', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-400 text-gray-700 bg-white"
                >
                  <option value="">All Makes</option>
                  {['Toyota', 'Mercedes', 'BMW', 'Nissan', 'Mazda', 'Subaru', 'Honda', 'Mitsubishi'].map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </div>

              {/* Fuel Type */}
              <div className="mb-6">
                <label className="text-xs font-bold text-gray-500 tracking-wider uppercase block mb-2">
                  Fuel Type
                </label>
                <div className="space-y-2">
                  {['petrol', 'diesel', 'electric', 'hybrid'].map(fuel => (
                    <label key={fuel} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="fuel_type"
                        value={fuel}
                        checked={filters.fuel_type === fuel}
                        onChange={e => handleFilter('fuel_type', e.target.value)}
                        className="accent-red-600"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 capitalize">
                        {fuel}
                      </span>
                    </label>
                  ))}
                  {filters.fuel_type && (
                    <button onClick={() => handleFilter('fuel_type', '')} className="text-xs text-red-500 mt-1">
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Transmission */}
              <div className="mb-6">
                <label className="text-xs font-bold text-gray-500 tracking-wider uppercase block mb-2">
                  Transmission
                </label>
                <div className="flex gap-2">
                  {['automatic', 'manual'].map(t => (
                    <button
                      key={t}
                      onClick={() => handleFilter('transmission', filters.transmission === t ? '' : t)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors capitalize ${
                        filters.transmission === t
                          ? 'bg-red-600 text-white border-red-600'
                          : 'border-gray-200 text-gray-600 hover:border-red-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div className="mb-2">
                <label className="text-xs font-bold text-gray-500 tracking-wider uppercase block mb-2">
                  Condition
                </label>
                <div className="flex gap-2">
                  {['new', 'used'].map(c => (
                    <button
                      key={c}
                      onClick={() => handleFilter('condition', filters.condition === c ? '' : c)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors capitalize ${
                        filters.condition === c
                          ? 'bg-red-600 text-white border-red-600'
                          : 'border-gray-200 text-gray-600 hover:border-red-300'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* CARS GRID */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-gray-100 rounded-xl h-80 animate-pulse" />
                ))}
              </div>
            ) : cars.length === 0 ? (
              <div className="text-center py-24 border-2 border-dashed border-gray-200 rounded-2xl">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-gray-500 font-semibold text-lg">No cars found</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 bg-red-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {cars.map(car => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

function CarCard({ car }) {
  const formatPrice = (price) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <Link
      href={`/cars/${car.id}`}
      className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative h-52 bg-gray-100 overflow-hidden">
        {car.images && car.images.length > 0 ? (
          <img
            src={car.images[0].image}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-20">🚗</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-bold px-3 py-1 rounded-full tracking-wide ${
            car.condition === 'new' ? 'bg-green-500 text-white' : 'bg-[#0D0D3B] text-white'
          }`}>
            {car.condition === 'new' ? 'NEW' : 'USED'}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-black text-[#0D0D3B] text-lg leading-tight group-hover:text-red-600 transition-colors">
          {car.year} {car.make} {car.model}
        </h3>
        <div className="flex flex-wrap gap-2 mt-3">
          {[
            { icon: '⛽', text: car.fuel_type },
            { icon: '⚙️', text: car.transmission },
            { icon: '📍', text: `${car.mileage?.toLocaleString()} km` },
          ].map(item => (
            <span key={item.text} className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
              {item.icon} {item.text}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <span className="text-red-600 font-black text-xl">{formatPrice(car.price)}</span>
          <span className="text-xs font-bold text-[#0D0D3B] bg-gray-100 group-hover:bg-red-600 group-hover:text-white px-3 py-1.5 rounded transition-colors">
            VIEW →
          </span>
        </div>
      </div>
    </Link>
  );
}