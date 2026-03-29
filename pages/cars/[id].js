import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import api from '../../lib/api';
import { useCart } from '../../context/CartContext';

export default function CarDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showEnquiry, setShowEnquiry] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get(`/api/cars/${id}/`)
      .then(res => setCar(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🚗</p>
          <h2 className="text-2xl font-black text-[#0D0D3B] mb-2">Car not found</h2>
          <Link href="/cars" className="text-red-600 font-semibold hover:underline">
            Back to all cars
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0,
    }).format(price);

  const handleBuyNow = () => {
    addToCart({
      id: car.id,
      type: 'car',
      name: `${car.year} ${car.make} ${car.model}`,
      price: parseFloat(car.price),
      image: car.images && car.images.length > 0 ? car.images[0].image : null,
    });
    router.push('/cart');
  };

  return (
    <div className="min-h-screen bg-white">

      {/* BREADCRUMB */}
      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
            <span>›</span>
            <Link href="/cars" className="hover:text-red-600 transition-colors">Cars</Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">{car.year} {car.make} {car.model}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* LEFT — Image Gallery */}
          <div>
            <div className="relative bg-gray-100 rounded-2xl overflow-hidden h-80 md:h-96 mb-4">
              {car.images && car.images.length > 0 ? (
                <img
                  src={car.images[activeImage]?.image}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-8xl opacity-20">🚗</span>
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                  car.condition === 'new' ? 'bg-green-500 text-white' : 'bg-[#0D0D3B] text-white'
                }`}>
                  {car.condition === 'new' ? 'NEW' : 'USED'}
                </span>
              </div>
            </div>

            {car.images && car.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {car.images.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(index)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      activeImage === index ? 'border-red-600' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={img.image}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Car Details */}
          <div>
            <h1 className="text-3xl font-black text-[#0D0D3B] leading-tight">
              {car.year} {car.make} {car.model}
            </h1>
            <p className="text-red-600 font-black text-3xl mt-3">{formatPrice(car.price)}</p>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              {[
                { label: 'Year', value: car.year, icon: '📅' },
                { label: 'Mileage', value: `${car.mileage?.toLocaleString()} km`, icon: '📍' },
                { label: 'Engine', value: car.engine, icon: '⚙️' },
                { label: 'Transmission', value: car.transmission, icon: '🔧' },
                { label: 'Fuel Type', value: car.fuel_type, icon: '⛽' },
                { label: 'Color', value: car.color, icon: '🎨' },
              ].map(spec => (
                <div key={spec.label} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                    {spec.icon} {spec.label}
                  </p>
                  <p className="font-bold text-[#0D0D3B] capitalize text-sm">{spec.value}</p>
                </div>
              ))}
            </div>

            {car.description && (
              <div className="mt-6">
                <h3 className="font-black text-[#0D0D3B] text-sm tracking-wider uppercase mb-2">
                  Description
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{car.description}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={handleBuyNow}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 font-black text-sm tracking-widest rounded-xl transition-colors"
              >
                BUY NOW
              </button>
              <button
                onClick={() => setShowEnquiry(!showEnquiry)}
                className="w-full border-2 border-[#0D0D3B] hover:border-red-600 text-[#0D0D3B] hover:text-red-600 py-4 font-black text-sm tracking-widest rounded-xl transition-colors"
              >
                ENQUIRE ABOUT THIS CAR
              </button>
              <Link
                href="/consultations"
                className="w-full border border-gray-200 hover:border-red-300 text-gray-600 hover:text-red-600 py-3 font-semibold text-sm text-center rounded-xl transition-colors"
              >
                Book a Consultation Instead
              </Link>
            </div>

            {/* Enquiry Form */}
            {showEnquiry && (
              <div className="mt-6 bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="font-black text-[#0D0D3B] text-sm mb-4">Send Enquiry</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-400"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-400"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-400"
                  />
                  <textarea
                    placeholder="Your message..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-400 resize-none"
                  />
                  <button className="w-full bg-[#0D0D3B] hover:bg-red-600 text-white py-3 font-bold text-sm rounded-lg transition-colors">
                    SEND ENQUIRY
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}