import { useState } from 'react';
import Link from 'next/link';
import api from '../lib/api';

export default function Preferences() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    budget_min: '',
    budget_max: '',
    preferred_make: '',
    preferred_model: '',
    year_min: '',
    year_max: '',
    fuel_type: 'any',
    transmission: 'any',
    max_mileage: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      budget_min: '',
      budget_max: '',
      preferred_make: '',
      preferred_model: '',
      year_min: '',
      year_max: '',
      fuel_type: 'any',
      transmission: 'any',
      max_mileage: '',
      notes: '',
    });
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.full_name || !formData.email || !formData.phone) {
      setError('Please fill in your name, email and phone number.');
      return;
    }

    if (formData.budget_min && formData.budget_max) {
      if (Number(formData.budget_min) > Number(formData.budget_max)) {
        setError('Minimum budget cannot be more than maximum budget.');
        return;
      }
    }

    setLoading(true);
    try {
      await api.post('/api/preferences/', formData);
      setShowSuccess(true);
      resetForm();
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* SUCCESS POPUP */}
      {showSuccess && (
        <div className="fixed top-6 right-6 z-50 max-w-sm w-full">
          <div className="bg-white border border-green-200 rounded-2xl shadow-2xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-black text-[#0D0D3B] text-sm">Preferences Submitted!</p>
              <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                Thank you. Our team will review your preferences and get back to you within 24 hours.
              </p>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Progress bar */}
          <div className="mt-1 h-0.5 bg-green-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full animate-[shrink_5s_linear_forwards]" />
          </div>
        </div>
      )}

      {/* PAGE HEADER */}
      <div className="bg-[#0D0D3B] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-red-500 text-xs font-bold tracking-widest uppercase mb-2">
            Personalised Service
          </p>
          <h1 className="text-4xl font-black">Find My Car</h1>
          <p className="text-gray-400 mt-2 max-w-xl">
            Tell us exactly what you are looking for and we will find it for you.
            Fill in as much or as little as you know.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl mb-8 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* CONTACT DETAILS */}
          <div>
            <h2 className="text-lg font-black text-[#0D0D3B] mb-1">Your Contact Details</h2>
            <p className="text-gray-400 text-sm mb-5">So we can get back to you with options.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 tracking-wider uppercase mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 tracking-wider uppercase mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+254 700 000 000"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 tracking-wider uppercase mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@email.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* BUDGET */}
          <div>
            <h2 className="text-lg font-black text-[#0D0D3B] mb-1">Budget Range</h2>
            <p className="text-gray-400 text-sm mb-5">In Kenyan Shillings. Leave blank if flexible.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 tracking-wider uppercase mb-2">
                  Minimum Budget (KES)
                </label>
                <input
                  type="number"
                  name="budget_min"
                  value={formData.budget_min}
                  onChange={handleChange}
                  placeholder="e.g. 1000000"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 tracking-wider uppercase mb-2">
                  Maximum Budget (KES)
                </label>
                <input
                  type="number"
                  name="budget_max"
                  value={formData.budget_max}
                  onChange={handleChange}
                  placeholder="e.g. 5000000"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* CAR PREFERENCES */}
          <div>
            <h2 className="text-lg font-black text-[#0D0D3B] mb-1">Car Preferences</h2>
            <p className="text-gray-400 text-sm mb-5">Tell us what you have in mind. All fields are optional.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 tracking-wider uppercase mb-2">
                  Preferred Make
                </label>
                <input
                  type="text"
                  name="preferred_make"
                  value={formData.preferred_make}
                  onChange={handleChange}
                  placeholder="e.g. Toyota, BMW"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 tracking-wider uppercase mb-2">
                  Preferred Model
                </label>
                <input
                  type="text"
                  name="preferred_model"
                  value={formData.preferred_model}
                  onChange={handleChange}
                  placeholder="e.g. Land Cruiser, X5"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 tracking-wider uppercase mb-2">
                  Year From
                </label>
                <input
                  type="number"
                  name="year_min"
                  value={formData.year_min}
                  onChange={handleChange}
                  placeholder="e.g. 2015"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 tracking-wider uppercase mb-2">
                  Year To
                </label>
                <input
                  type="number"
                  name="year_max"
                  value={formData.year_max}
                  onChange={handleChange}
                  placeholder="e.g. 2023"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 tracking-wider uppercase mb-2">
                  Max Mileage (km)
                </label>
                <input
                  type="number"
                  name="max_mileage"
                  value={formData.max_mileage}
                  onChange={handleChange}
                  placeholder="e.g. 80000"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400"
                />
              </div>
            </div>

            {/* Fuel Type */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-500 tracking-wider uppercase mb-3">
                Fuel Type
              </label>
              <div className="flex flex-wrap gap-2">
                {['any', 'petrol', 'diesel', 'electric', 'hybrid'].map(fuel => (
                  <button
                    key={fuel}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, fuel_type: fuel }))}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold border transition-all capitalize ${
                      formData.fuel_type === fuel
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'
                    }`}
                  >
                    {fuel === 'any' ? 'Any' : fuel}
                  </button>
                ))}
              </div>
            </div>

            {/* Transmission */}
            <div>
              <label className="block text-xs font-bold text-gray-500 tracking-wider uppercase mb-3">
                Transmission
              </label>
              <div className="flex flex-wrap gap-2">
                {['any', 'automatic', 'manual'].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, transmission: t }))}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold border transition-all capitalize ${
                      formData.transmission === t
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'
                    }`}
                  >
                    {t === 'any' ? 'Any' : t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* ADDITIONAL NOTES */}
          <div>
            <h2 className="text-lg font-black text-[#0D0D3B] mb-1">Anything Else?</h2>
            <p className="text-gray-400 text-sm mb-5">
              Any specific requirements, features, or details we should know about.
            </p>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="e.g. I need a 7-seater, sunroof preferred, must have low mileage..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 resize-none"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 font-black text-sm tracking-widest rounded-xl transition-colors flex items-center justify-center gap-3 ${
              loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                SUBMITTING...
              </>
            ) : (
              'SUBMIT MY PREFERENCES'
            )}
          </button>

          <p className="text-center text-xs text-gray-400">
            We will contact you within 24 hours with available options.
          </p>

        </form>
      </div>
    </div>
  );
}