import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../lib/api';

export default function Consultations() {
  const [types, setTypes] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/consultations/types/')
      .then(res => setTypes(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedDate || !selectedType) return;
    setSlotsLoading(true);
    api.get(`/api/consultations/slots/?date=${selectedDate}&consultation_type=${selectedType.id}`)
      .then(res => setSlots(res.data))
      .catch(err => console.error(err))
      .finally(() => setSlotsLoading(false));
  }, [selectedDate, selectedType]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.customer_name || !formData.customer_email || !formData.customer_phone) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/api/consultations/bookings/', {
        ...formData,
        slot_id: selectedSlot.id,
        amount_paid: selectedType.price,
      });
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0,
    }).format(price);

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${minutes} ${ampm}`;
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🎉</span>
          </div>
          <h2 className="text-3xl font-black text-[#0D0D3B] mb-3">Booking Confirmed!</h2>
          <p className="text-gray-500 leading-relaxed mb-2">
            Thank you {formData.customer_name.split(' ')[0]}. Your consultation has been booked.
          </p>
          <p className="text-gray-500 leading-relaxed mb-8">
            We will send you a confirmation and session details to {formData.customer_email}.
          </p>
          <div className="bg-gray-50 rounded-xl p-5 mb-8 text-left">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Service</span>
              <span className="text-sm font-bold text-[#0D0D3B]">{selectedType.name}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Date</span>
              <span className="text-sm font-bold text-[#0D0D3B]">{selectedDate}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Time</span>
              <span className="text-sm font-bold text-[#0D0D3B]">{formatTime(selectedSlot.start_time)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-500">Amount</span>
              <span className="text-sm font-bold text-red-600">{formatPrice(selectedType.price)}</span>
            </div>
          </div>
          <Link
            href="/"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 font-bold text-sm tracking-widest rounded-xl transition-colors inline-block"
          >
            BACK TO HOME
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* PAGE HEADER */}
      <div className="bg-[#0D0D3B] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-red-500 text-xs font-bold tracking-widest uppercase mb-2">
            Expert Advice
          </p>
          <h1 className="text-4xl font-black">Book a Consultation</h1>
          <p className="text-gray-400 mt-2 max-w-xl">
            Speak directly with our experts. Whether you need help importing a car,
            finding spare parts, or getting mechanical advice — we are here to help.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* STEP INDICATOR */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {[
            { num: 1, label: 'Choose Service' },
            { num: 2, label: 'Pick a Slot' },
            { num: 3, label: 'Your Details' },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                  step >= s.num ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className={`text-xs font-bold hidden sm:block ${
                  step >= s.num ? 'text-[#0D0D3B]' : 'text-gray-400'
                }`}>
                  {s.label}
                </span>
              </div>
              {i < 2 && (
                <div className={`w-12 h-0.5 mx-1 ${step > s.num ? 'bg-red-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl mb-8 text-sm font-medium">
            {error}
          </div>
        )}

        {/* STEP 1 — CHOOSE SERVICE */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-black text-[#0D0D3B] mb-2">Choose a Service</h2>
            <p className="text-gray-400 text-sm mb-8">Select the type of consultation you need.</p>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-gray-100 rounded-xl h-40 animate-pulse" />
                ))}
              </div>
            ) : types.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
                <p className="text-4xl mb-4">📅</p>
                <p className="text-gray-500 font-semibold">No consultation services available yet</p>
                <p className="text-gray-400 text-sm mt-1">Please check back soon</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {types.map(type => (
                  <button
                    key={type.id}
                    onClick={() => { setSelectedType(type); setStep(2); }}
                    className="text-left bg-white border-2 border-gray-200 hover:border-red-500 rounded-xl p-6 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-black text-[#0D0D3B] text-lg group-hover:text-red-600 transition-colors">
                        {type.name}
                      </h3>
                      <span className="text-red-600 font-black text-lg ml-4 flex-shrink-0">
                        {formatPrice(type.price)}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{type.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        🕐 {type.duration_minutes} minutes
                      </span>
                      <span className="flex items-center gap-1 capitalize">
                        📍 {type.meeting_type}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 2 — PICK A SLOT */}
        {step === 2 && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => { setStep(1); setSelectedSlot(null); setSlots([]); }}
                className="text-gray-400 hover:text-red-600 transition-colors text-sm font-semibold flex items-center gap-1"
              >
                Back
              </button>
              <div>
                <h2 className="text-2xl font-black text-[#0D0D3B]">Pick a Date and Time</h2>
                <p className="text-gray-400 text-sm">
                  Booking: <span className="text-red-600 font-semibold">{selectedType?.name}</span>
                </p>
              </div>
            </div>

            {/* Date Picker */}
            <div className="mb-8">
              <label className="block text-xs font-bold text-gray-500 tracking-wider uppercase mb-3">
                Select Date
              </label>
              <input
                type="date"
                min={getTodayDate()}
                value={selectedDate}
                onChange={e => { setSelectedDate(e.target.value); setSelectedSlot(null); }}
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 w-full md:w-64"
              />
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div>
                <label className="block text-xs font-bold text-gray-500 tracking-wider uppercase mb-3">
                  Available Time Slots
                </label>
                {slotsLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="bg-gray-100 rounded-xl h-14 animate-pulse" />
                    ))}
                  </div>
                ) : slots.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                    <p className="text-gray-500 font-semibold">No slots available for this date</p>
                    <p className="text-gray-400 text-sm mt-1">Please try a different date</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {slots.map(slot => (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all ${
                          selectedSlot?.id === slot.id
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-white text-[#0D0D3B] border-gray-200 hover:border-red-400'
                        }`}
                      >
                        {formatTime(slot.start_time)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedSlot && (
              <div className="mt-8">
                <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-100">
                  <h3 className="font-black text-[#0D0D3B] text-sm mb-3">Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Service</span>
                      <span className="font-semibold">{selectedType?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date</span>
                      <span className="font-semibold">{selectedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Time</span>
                      <span className="font-semibold">{formatTime(selectedSlot.start_time)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-500">Amount</span>
                      <span className="font-black text-red-600">{formatPrice(selectedType?.price)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setStep(3)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-4 font-black text-sm tracking-widest rounded-xl transition-colors"
                >
                  CONTINUE TO BOOKING
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 3 — YOUR DETAILS */}
        {step === 3 && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => setStep(2)}
                className="text-gray-400 hover:text-red-600 transition-colors text-sm font-semibold"
              >
                Back
              </button>
              <div>
                <h2 className="text-2xl font-black text-[#0D0D3B]">Your Details</h2>
                <p className="text-gray-400 text-sm">Almost done. Fill in your contact information.</p>
              </div>
            </div>

            {/* Booking summary bar */}
            <div className="bg-[#0D0D3B] text-white rounded-xl p-4 mb-8 flex flex-wrap gap-4 justify-between items-center">
              <div className="text-sm">
                <span className="text-gray-400">Service: </span>
                <span className="font-bold">{selectedType?.name}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">Date: </span>
                <span className="font-bold">{selectedDate}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">Time: </span>
                <span className="font-bold">{formatTime(selectedSlot?.start_time)}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">Fee: </span>
                <span className="font-bold text-red-400">{formatPrice(selectedType?.price)}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 tracking-wider uppercase mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
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
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleChange}
                    placeholder="+254 700 000 000"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 tracking-wider uppercase mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="customer_email"
                  value={formData.customer_email}
                  onChange={handleChange}
                  placeholder="john@email.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 tracking-wider uppercase mb-2">
                  What do you need help with?
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us briefly what you would like to discuss in the session..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-4 font-black text-sm tracking-widest rounded-xl transition-colors ${
                  submitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {submitting ? 'BOOKING...' : 'CONFIRM BOOKING'}
              </button>

              <p className="text-center text-xs text-gray-400">
                Payment will be collected at the time of your session.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}