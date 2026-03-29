import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import api from '../lib/api';

export default function OrderConfirmation() {
  const router = useRouter();
  const { ref, order } = router.query;
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!ref) return;

    api.get(`/api/payments/verify/${ref}/`)
      .then(res => {
        if (res.data.status === 'success') {
          setVerified(true);
        }
      })
      .catch(err => {
        console.error(err);
        setVerified(false);
      })
      .finally(() => setVerifying(false));
  }, [ref]);

  if (verifying) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">

        {/* Icon */}
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
          verified ? 'bg-green-50' : 'bg-yellow-50'
        }`}>
          <span className="text-5xl">{verified ? '🎉' : '✅'}</span>
        </div>

        <h1 className="text-3xl font-black text-[#0D0D3B] mb-3">
          {verified ? 'Payment Confirmed!' : 'Order Received!'}
        </h1>

        <p className="text-gray-500 leading-relaxed mb-6">
          {verified
            ? 'Your payment was successful. We will contact you shortly to arrange delivery.'
            : 'Your order has been placed. We are confirming your payment and will contact you shortly.'
          }
        </p>

        {/* Order Details */}
        {order && (
          <div className="bg-gray-50 rounded-xl p-5 mb-8 text-left">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Order Number</span>
              <span className="text-sm font-black text-[#0D0D3B]">{order}</span>
            </div>
            {ref && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Payment Reference</span>
                <span className="text-sm font-bold text-green-600">{ref}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-500">Status</span>
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                verified
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {verified ? 'Paid' : 'Processing'}
              </span>
            </div>
          </div>
        )}

        <p className="text-sm text-gray-400 mb-8">
          A confirmation will be sent to your email. Our team will reach out within 24 hours.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/cars"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 font-bold text-sm tracking-widest rounded-xl transition-colors"
          >
            CONTINUE SHOPPING
          </Link>
          <Link
            href="/contact"
            className="border-2 border-gray-200 hover:border-red-300 text-gray-600 px-8 py-3.5 font-bold text-sm tracking-widest rounded-xl transition-colors"
          >
            CONTACT US
          </Link>
        </div>

      </div>
    </div>
  );
}
