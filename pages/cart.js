import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0,
    }).format(price);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-[#0D0D3B] mb-3">Your cart is empty</h2>
          <p className="text-gray-400 mb-8">
            Browse our cars and spare parts and add items to your cart.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/cars"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 font-bold text-sm tracking-widest rounded-xl transition-colors"
            >
              BROWSE CARS
            </Link>
            <Link
              href="/parts"
              className="border-2 border-gray-200 hover:border-red-300 text-gray-600 px-8 py-3.5 font-bold text-sm tracking-widest rounded-xl transition-colors"
            >
              SPARE PARTS
            </Link>
          </div>
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
            Your Selection
          </p>
          <h1 className="text-4xl font-black">Your Cart</h1>
          <p className="text-gray-400 mt-2">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT — Cart Items */}
          <div className="lg:col-span-2 space-y-4">

            {cartItems.map(item => (
              <div
                key={`${item.type}-${item.id}`}
                className="bg-white border border-gray-200 rounded-xl p-5 flex gap-5 hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="w-24 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl opacity-30">
                      {item.type === 'car' ? '🚗' : '🔩'}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        item.type === 'car'
                          ? 'bg-[#0D0D3B] text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {item.type === 'car' ? 'CAR' : 'PART'}
                      </span>
                      <h3 className="font-black text-[#0D0D3B] mt-1 text-sm leading-tight">
                        {item.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id, item.type)}
                      className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-red-600 font-black">
                      {formatPrice(item.price * item.quantity)}
                    </span>

                    {/* Quantity controls — only for parts */}
                    {item.type === 'part' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-red-400 hover:text-red-600 transition-colors text-sm font-bold"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-[#0D0D3B]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-red-400 hover:text-red-600 transition-colors text-sm font-bold"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium">Qty: 1</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Clear cart */}
            <div className="pt-2">
              <button
                onClick={clearCart}
                className="text-sm text-gray-400 hover:text-red-500 font-semibold transition-colors"
              >
                Clear entire cart
              </button>
            </div>
          </div>

          {/* RIGHT — Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">
              <h2 className="font-black text-[#0D0D3B] text-lg mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                {cartItems.map(item => (
                  <div key={`${item.type}-${item.id}`} className="flex justify-between text-sm">
                    <span className="text-gray-500 truncate mr-2">
                      {item.name} {item.quantity > 1 && `x${item.quantity}`}
                    </span>
                    <span className="font-semibold text-[#0D0D3B] flex-shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-black text-[#0D0D3B]">Total</span>
                  <span className="font-black text-red-600 text-xl">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-red-600 hover:bg-red-700 text-white py-4 font-black text-sm tracking-widest rounded-xl transition-colors text-center"
              >
                PROCEED TO CHECKOUT
              </Link>

              <Link
                href="/cars"
                className="block w-full text-center text-gray-400 hover:text-red-600 text-sm font-semibold mt-4 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}