import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function Home() {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroImages, setHeroImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    api.get('/api/cars/')
      .then(res => {
        const cars = res.data;
        const images = cars
          .filter(car => car.images && car.images.length > 0)
          .map(car => car.images[0].image);
        setHeroImages(images);
      })
      .catch(err => console.error(err));

    api.get('/api/cars/featured/')
      .then(res => setFeaturedCars(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (heroImages.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages]);

  return (
    <>
      {/* HERO */}
<section className="relative text-white overflow-hidden min-h-[580px] flex items-center">

  {/* Background slideshow */}
  {heroImages.map((img, index) => (
    <div
      key={index}
      className="absolute inset-0 transition-opacity duration-1000"
      style={{ opacity: index === currentSlide ? 1 : 0 }}
    >
      <img
        src={img}
        alt="Featured car"
        className="w-full h-full object-cover"
      />
    </div>
  ))}

  {/* Strong dark overlay */}
  <div className="absolute inset-0 bg-[#0D0D3B] opacity-75 z-10" />

  {/* Red bottom line */}
  <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 z-20" />

  {/* Slide indicators */}
  {heroImages.length > 0 && (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
      {heroImages.map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentSlide(index)}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            index === currentSlide ? 'w-8 bg-red-500' : 'w-2 bg-white opacity-50'
          }`}
        />
      ))}
    </div>
  )}

  {/* Content */}
  <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
    <div className="inline-flex items-center gap-2 bg-red-600 bg-opacity-20 border border-red-600 border-opacity-40 rounded-full px-4 py-1.5 mb-6">
      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      <span className="text-red-400 text-xs font-bold tracking-widest">
        KENYA&apos;S TRUSTED CAR IMPORTER
      </span>
    </div>
    <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 max-w-3xl">
      Drive Your{' '}
      <span className="text-red-500">Dream Car</span>{' '}
      Home Today
    </h1>
    <p className="text-gray-300 text-lg max-w-xl mb-10 leading-relaxed">
      Premium imported vehicles, genuine spare parts, and expert
      consultation — all in one place.
    </p>
    <div className="flex flex-wrap gap-4">
      <Link
        href="/cars"
        className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 font-bold text-sm tracking-widest rounded transition-colors"
      >
        BROWSE CARS
      </Link>
      <Link
        href="/preferences"
        className="border-2 border-white hover:border-red-500 text-white px-8 py-4 font-bold text-sm tracking-widest rounded transition-colors"
      >
        FIND MY CAR
      </Link>
    </div>
  </div>
</section>
{/* STATS BAR */}
<section className="bg-white py-10 border-b border-gray-100">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[
        {
          icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h10l2-2z" />
            </svg>
          ),
          number: '500+',
          label: 'Cars Imported',
        },
        {
          icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
          number: '1,200+',
          label: 'Happy Clients',
        },
        {
          icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          ),
          number: '10+',
          label: 'Years Experience',
        },
        {
          icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          ),
          number: '24/7',
          label: 'Customer Support',
        },
      ].map(stat => (
        <div
          key={stat.label}
          className="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-gray-100 hover:border-red-200 hover:shadow-md transition-all group"
        >
          <div className="text-red-600 mb-3 group-hover:scale-110 transition-transform">
            {stat.icon}
          </div>
          <div className="text-3xl font-black text-[#0D0D3B]">{stat.number}</div>
          <div className="text-gray-400 text-xs tracking-wide mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  </div>
</section>
      {/* FEATURED CARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-red-600 text-xs font-bold tracking-widest uppercase mb-2">
              Hand Picked
            </p>
            <h2 className="text-3xl font-black text-[#0D0D3B]">
              Featured Vehicles
            </h2>
          </div>
          <Link
            href="/cars"
            className="hidden md:flex items-center gap-1 text-red-600 hover:text-red-700 font-bold text-sm transition-colors"
          >
            View All <span className="text-lg">→</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-100 rounded-xl h-80 animate-pulse" />
            ))}
          </div>
        ) : featuredCars.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-5xl mb-4">🚗</p>
            <p className="text-gray-500 font-medium">
              Featured vehicles coming soon
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}

        <div className="text-center mt-10 md:hidden">
          <Link
            href="/cars"
            className="bg-red-600 text-white px-8 py-3.5 font-bold text-sm tracking-widest rounded inline-block"
          >
            VIEW ALL STOCK
          </Link>
        </div>
      </section>

      {/* SPARE PARTS BANNER */}
      <section className="bg-[#0D0D3B] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-red-500 text-xs font-bold tracking-widest uppercase mb-3">
                Genuine Parts
              </p>
              <h2 className="text-4xl font-black mb-6 leading-tight">
                Need Spare Parts <br />For Your Car?
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8">
                We stock genuine spare parts for a wide range of makes and
                models. Engine parts, brakes, suspension, filters and more —
                all sourced from trusted suppliers.
              </p>
              <Link
                href="/parts"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 font-bold text-sm tracking-widest rounded transition-colors inline-block"
              >
                BROWSE PARTS
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '⚙️', label: 'Engine Parts', desc: 'Full engine components' },
                { icon: '🔧', label: 'Brake Pads', desc: 'All makes & models' },
                { icon: '🛞', label: 'Suspension', desc: 'Shocks & struts' },
                { icon: '🔩', label: 'Filters', desc: 'Oil, air & fuel' },
              ].map(item => (
                <div
                  key={item.label}
                  className="bg-[#12124F] border border-[#1A1A6E] hover:border-red-600 rounded-xl p-6 transition-colors cursor-pointer group"
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <div className="text-sm font-bold text-white">{item.label}</div>
                  <div className="text-xs text-gray-500 mt-1 group-hover:text-gray-400">
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONSULTATION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative bg-[#0D0D3B] rounded-2xl p-10 md:p-16 text-white overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-600" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-red-600 opacity-10 rounded-full translate-x-8 translate-y-8" />
          <div className="relative z-10 text-center">
            <p className="text-red-500 text-xs font-bold tracking-widest mb-3">
              EXPERT ADVICE
            </p>
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Not Sure Which Car to Buy?
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
              Book a one-on-one consultation with our experts. We&apos;ll help
              you find the perfect car within your budget.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/consultations"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 font-bold text-sm tracking-widest rounded transition-colors"
              >
                BOOK A SESSION
              </Link>
              <Link
                href="/preferences"
                className="border-2 border-gray-600 hover:border-red-600 text-white px-8 py-4 font-bold text-sm tracking-widest rounded transition-colors"
              >
                TELL US WHAT YOU WANT
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
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
      className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-52 bg-gray-100 overflow-hidden">
        {car.images && car.images.length > 0 ? (
          <img
           src={car.images[0].image}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <span className="text-6xl opacity-30">🚗</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-bold px-3 py-1 rounded-full tracking-wide ${
            car.condition === 'new'
              ? 'bg-green-500 text-white'
              : 'bg-[#0D0D3B] text-white'
          }`}>
            {car.condition === 'new' ? 'NEW' : 'USED'}
          </span>
        </div>
      </div>

      {/* Info */}
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
            <span
              key={item.text}
              className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full"
            >
              {item.icon} {item.text}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <span className="text-red-600 font-black text-xl">
            {formatPrice(car.price)}
          </span>
          <span className="text-xs font-bold text-[#0D0D3B] bg-gray-100 group-hover:bg-red-600 group-hover:text-white px-3 py-1.5 rounded transition-colors">
            VIEW →
          </span>
        </div>
      </div>
    </Link>
  );
}