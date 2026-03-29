import { useState, useEffect } from 'react';
import api from '../lib/api';
import { useCart } from '../context/CartContext';

const CATEGORIES = [
  { value: '', label: 'All Parts' },
  { value: 'engine', label: 'Engine Parts' },
  { value: 'brakes', label: 'Brake Pads' },
  { value: 'suspension', label: 'Suspension' },
  { value: 'filters', label: 'Filters' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'other', label: 'Other' },
];

export default function Parts() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (activeCategory) params.append('category', activeCategory);

    api.get(`/api/parts/?${params.toString()}`)
      .then(res => setParts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [search, activeCategory]);

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className="min-h-screen bg-white">

      {/* PAGE HEADER */}
      <div className="bg-[#0D0D3B] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-red-500 text-xs font-bold tracking-widest uppercase mb-2">
            Genuine Parts
          </p>
          <h1 className="text-4xl font-black">Spare Parts Store</h1>
          <p className="text-gray-400 mt-2">
            {loading ? 'Loading...' : `${parts.length} part${parts.length !== 1 ? 's' : ''} available`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* SEARCH BAR */}
        <div className="mb-8">
          <div className="relative max-w-xl">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by part name, compatible car..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-red-400 shadow-sm"
            />
          </div>
        </div>

        {/* CATEGORY TABS */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                activeCategory === cat.value
                  ? 'bg-red-600 text-white border-red-600 shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-red-300 hover:text-red-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* PARTS GRID */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : parts.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-500 font-semibold text-lg">No parts found</p>
            <p className="text-gray-400 text-sm mt-1">Try a different category or search term</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory(''); }}
              className="mt-4 bg-red-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {parts.map(part => (
              <PartCard key={part.id} part={part} formatPrice={formatPrice} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PartCard({ part, formatPrice }) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart({
      id: part.id,
      type: 'part',
      name: part.name,
      price: parseFloat(part.price),
      image: part.images && part.images.length > 0 ? part.images[0].image : null,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

      {/* Image */}
      <div className="relative h-44 bg-gray-50 overflow-hidden">
        {part.images && part.images.length > 0 ? (
          <img
            src={part.images[0].image}
            alt={part.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#0D0D3B] text-white capitalize">
            {part.category}
          </span>
        </div>

        {/* Stock badge */}
        <div className="absolute top-3 right-3">
          {part.stock_quantity > 0 ? (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-500 text-white">
              In Stock
            </span>
          ) : (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-500 text-white">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-[#0D0D3B] text-sm leading-tight line-clamp-2 mb-1">
          {part.name}
        </h3>

        {part.compatible_makes && (
          <p className="text-xs text-gray-400 mb-2 truncate">
            Fits: {part.compatible_makes}
          </p>
        )}

        {part.part_number && (
          <p className="text-xs text-gray-400 font-mono mb-2">
            Part No: {part.part_number}
          </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-red-600 font-black text-lg">
            {formatPrice(part.price)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={part.stock_quantity === 0}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
              part.stock_quantity === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : added
                ? 'bg-green-500 text-white'
                : 'bg-[#0D0D3B] hover:bg-red-600 text-white'
            }`}
          >
            {added ? 'Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
