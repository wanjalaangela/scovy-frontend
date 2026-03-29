import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import api from '../lib/api';

export default function Checkout() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0,
    }).format(price);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getOrderType = () => {
    const hasCar = cartItems.some(i => i.type === 'car');
    const hasPart = cartItems.some(i => i.type === 'part');
    if (hasCar && hasPart) return 'mixed';
    if (hasCar) return 'car';
    return 'parts';
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.customer_name || !formData.customer_email || !formData.customer_phone) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        order_type: getOrderType(),
        subtotal: cartTotal,
        total_amount: cartTotal,
        payment_method: 'visa',
        items: cartItems.map(item => ({
          item_type: item.type,
          ...(item.type === 'car' ? { car: item.id } : { part: item.id }),
          quantity: item.quantity,
          unit_price: item.price,
          line_total: item.price * item.quantity,
        })),
      };

      const orderRes = await api.post('/api/orders/', orderData);
      const order = orderRes.data;

      const PaystackPop = (await import('@paystack/inline-js')).default;
      const paystack = new PaystackPop();

      paystack.newTransaction({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: formData.customer_email,
        amount: Math.round(cartTotal * 100),
        currency: 'KES',
        ref: order.order_number,
        firstname: formData.customer_name.split(' ')[0],
        lastname: formData.customer_name.split(' ')[1] || '',
        phone: formData.customer_phone,
        metadata: {
          order_id: order.id,
          order_number: order.order_number,
          customer_phone: formData.customer_phone,
        },
        onSuccess: (transaction) => {
          clearCart();
          router.push(
            `/order-confirmation?ref=${transaction.reference}&order=${order.order_number}`
          );
        },
        onCancel: () => {
          setError('Payment was cancelled. You can try again.');
          setLoading(false);
        },
      });

    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-5xl mb-4">🛒</p>
          <h2 className="text-2xl font-black text-[#0D0D3B] mb-3">Your cart is empty</h2>
          <p className="text-gray-400 mb-8">
            Add some items to your cart before checking out.
          </p>
          <Link
            href="/cars"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 font-bold text-sm tracking-widest rounded-xl transition-colors inline-block"
          >
            BROWSE CARS
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
            Final Step
          </p>
          <h1 className="text-4xl font-black">Checkout</h1>
          <p className="text-gray-400 mt-2">
            Fill in your details and complete your payment.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT — Customer Details */}
          <div className="lg:col-span-2">

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl mb-6 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handlePayment} className="space-y-6">

              {/* Contact Details */}
              <div>
                <h2 className="text-lg font-black text-[#0D0D3B] mb-1">Your Details</h2>
                <p className="text-gray-400 text-sm mb-5">
                  We will use these to send your order confirmation.
                </p>
                <div className="space-y-4">
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
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="customer_phone"
                        value={formData.customer_phone}
                        onChange={handleChange}
                        placeholder="0712 345 678"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 tracking-wider uppercase mb-2">
                      Email Address <span className="text-red-500">*</span>
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
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Payment Methods */}
              <div>
                <h2 className="text-lg font-black text-[#0D0D3B] mb-1">Payment</h2>
                <p className="text-gray-400 text-sm mb-5">
                  Select your preferred payment method.
                </p>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <p className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-4">
                    Accepted Payment Methods
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-green-100 text-green-700">
                      <span>📱</span> M-Pesa
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                      <span>💳</span> Visa
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-red-100 text-red-700">
                      <span>💳</span> Mastercard
                    </div>
                  </div>
                </div>
              </div>

              {/* Pay Button */}
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
                    PROCESSING...
                  </>
                ) : (
                  `PAY ${formatPrice(cartTotal)} SECURELY`
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secured by Paystack. We never store your card details.
              </div>

            </form>
          </div>

          {/* RIGHT — Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">
              <h2 className="font-black text-[#0D0D3B] text-lg mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <div key={`${item.type}-${item.id}`} className="flex gap-3">
                    <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl opacity-30">
                          {item.type === 'car' ? '🚗' : '🔩'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#0D0D3B] truncate leading-tight">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 capitalize">{item.type}</p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      )}
                    </div>
                    <p className="text-sm font-black text-[#0D0D3B] flex-shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Delivery</span>
                  <span className="text-green-600 font-semibold">To be arranged</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="font-black text-[#0D0D3B]">Total</span>
                  <span className="font-black text-red-600 text-xl">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
              </div>

              <Link
                href="/cart"
                className="block text-center text-gray-400 hover:text-red-600 text-sm font-semibold mt-5 transition-colors"
              >
                Edit Cart
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}