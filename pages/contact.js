import { useState } from 'react';
import Link from 'next/link';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white">

      {/* PAGE HEADER */}
      <div className="bg-[#0D0D3B] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-red-500 text-xs font-bold tracking-widest uppercase mb-2">
            Get In Touch
          </p>
          <h1 className="text-4xl font-black">Contact Us</h1>
          <p className="text-gray-400 mt-2">
            We are here to help. Reach out and we will get back to you within 24 hours.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* LEFT — Contact Info */}
          <div>
            <h2 className="text-2xl font-black text-[#0D0D3B] mb-8">Our Information</h2>

            <div className="space-y-6">

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0 text-red-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-black text-[#0D0D3B] text-sm mb-1">Visit Us</h3>
                  <p className="text-gray-500 text-sm">Nairobi, Kenya</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0 text-red-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-black text-[#0D0D3B] text-sm mb-1">Call Us</h3>
                  <p className="text-gray-500 text-sm">+254 700 000 000</p>
                  <p className="text-gray-500 text-sm">+254 711 000 000</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0 text-red-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-black text-[#0D0D3B] text-sm mb-1">Email Us</h3>
                  <p className="text-gray-500 text-sm">info@scovyimports.com</p>
                  <p className="text-gray-500 text-sm">sales@scovyimports.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0 text-red-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-black text-[#0D0D3B] text-sm mb-1">Working Hours</h3>
                  <p className="text-gray-500 text-sm">Monday - Friday: 8am - 6pm</p>
                  <p className="text-gray-500 text-sm">Saturday: 9am - 4pm</p>
                  <p className="text-gray-500 text-sm">Sunday: Closed</p>
                </div>
              </div>

            </div>

            {/* Social */}
            <div className="mt-10">
              <h3 className="font-black text-[#0D0D3B] text-sm mb-4">Follow Us</h3>
              <div className="flex gap-3">
                <a href="#" className="px-4 py-2 rounded-full bg-[#0D0D3B] hover:bg-red-600 text-white text-xs font-bold transition-colors">Facebook</a>
                <a href="#" className="px-4 py-2 rounded-full bg-[#0D0D3B] hover:bg-red-600 text-white text-xs font-bold transition-colors">Instagram</a>
                <a href="#" className="px-4 py-2 rounded-full bg-[#0D0D3B] hover:bg-red-600 text-white text-xs font-bold transition-colors">Twitter</a>
              </div>
            </div>

            {/* Map */}
            <div className="mt-10 bg-gray-100 rounded-2xl h-56 flex items-center justify-center border border-gray-200">
              <p className="text-gray-400 text-sm font-medium">Map coming soon</p>
            </div>
          </div>

          {/* RIGHT — Form */}
          <div>
            <h2 className="text-2xl font-black text-[#0D0D3B] mb-8">Send Us a Message</h2>

            {submitted ? (
              <div className="text-center py-16 bg-green-50 rounded-2xl border border-green-100">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-[#0D0D3B] mb-2">Message Sent!</h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">
                  Thank you for reaching out. We will get back to you within 24 hours.
                </p>
                <button
                  onClick={resetForm}
                  className="mt-6 text-red-600 font-bold text-sm hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 tracking-wider uppercase mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Joy Baraka"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 tracking-wider uppercase mb-2">
                      Phone
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
                    required
                    placeholder="john@email.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 tracking-wider uppercase mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="How can we help you today?"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 font-black text-sm tracking-widest rounded-xl transition-colors ${
                    loading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {loading ? 'SENDING...' : 'SEND MESSAGE'}
                </button>

                <p className="text-center text-xs text-gray-400">
                  We typically respond within 24 hours on business days.
                </p>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* BOTTOM CTA */}
      <section className="bg-[#0D0D3B] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            Ready to Find Your Dream Car?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Browse our current stock or tell us what you are looking for and we will find it for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/cars"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 font-bold text-sm tracking-widest rounded-xl transition-colors"
            >
              BROWSE CARS
            </Link>
            <Link
              href="/preferences"
              className="border-2 border-gray-600 hover:border-red-500 text-white px-8 py-4 font-bold text-sm tracking-widest rounded-xl transition-colors"
            >
              FIND MY CAR
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}