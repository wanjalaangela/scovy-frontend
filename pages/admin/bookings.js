import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../lib/api';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [meetingLink, setMeetingLink] = useState({});
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    api.get('/api/consultations/bookings/')
      .then(res => setBookings(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (booking, status) => {
    try {
      await api.patch(`/api/consultations/bookings/${booking.id}/`, { status });
      setBookings(prev =>
        prev.map(b => b.id === booking.id ? { ...b, status } : b)
      );
    } catch (err) {
      alert('Failed to update booking.');
    }
  };

  const handleSaveMeetingLink = async (booking) => {
    setSaving(booking.id);
    try {
      await api.patch(`/api/consultations/bookings/${booking.id}/`, {
        meeting_link: meetingLink[booking.id] || booking.meeting_link,
      });
      setBookings(prev =>
        prev.map(b => b.id === booking.id
          ? { ...b, meeting_link: meetingLink[booking.id] }
          : b
        )
      );
      setMeetingLink(prev => ({ ...prev, [booking.id]: undefined }));
    } catch (err) {
      alert('Failed to save meeting link.');
    } finally {
      setSaving(null);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-KE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${minutes} ${ampm}`;
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0,
    }).format(price);

  const filtered = bookings.filter(b =>
    filter ? b.status === filter : true
  );

  const statusColors = {
    confirmed: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <AdminLayout title="Consultation Bookings">

      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 bg-white text-gray-700"
        >
          <option value="">All Bookings</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <div className="flex gap-3 text-sm">
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-bold">
            Confirmed: {bookings.filter(b => b.status === 'confirmed').length}
          </div>
          <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl font-bold">
            Completed: {bookings.filter(b => b.status === 'completed').length}
          </div>
        </div>
      </div>

      {/* Bookings */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-4xl mb-3">📅</p>
          <p className="text-gray-500 font-semibold">No bookings found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(booking => (
            <div key={booking.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">

                {/* Left */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-xs font-bold text-gray-400">{booking.booking_reference}</span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${statusColors[booking.status]}`}>
                      {booking.status}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      booking.payment_status === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {booking.payment_status}
                    </span>
                  </div>

                  <h3 className="font-black text-[#0D0D3B] text-lg">{booking.customer_name}</h3>
                  <p className="text-sm text-gray-400">{booking.customer_phone} · {booking.customer_email}</p>

                  {booking.slot && (
                    <div className="flex flex-wrap gap-4 mt-3 text-sm">
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <p className="text-xs text-gray-400">Date</p>
                        <p className="font-bold text-[#0D0D3B]">{formatDate(booking.slot.date)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <p className="text-xs text-gray-400">Time</p>
                        <p className="font-bold text-[#0D0D3B]">{formatTime(booking.slot.start_time)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <p className="text-xs text-gray-400">Fee</p>
                        <p className="font-bold text-red-600">{formatPrice(booking.amount_paid)}</p>
                      </div>
                    </div>
                  )}

                  {booking.notes && (
                    <p className="text-sm text-gray-500 mt-3 bg-blue-50 rounded-lg p-3">
                      {booking.notes}
                    </p>
                  )}
                </div>

                {/* Right — Actions */}
                <div className="flex flex-col gap-3 min-w-48">

                  {/* Meeting link */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Meeting Link</p>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://meet.google.com/..."
                        defaultValue={booking.meeting_link}
                        onChange={e => setMeetingLink(prev => ({ ...prev, [booking.id]: e.target.value }))}
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-400"
                      />
                      <button
                        onClick={() => handleSaveMeetingLink(booking)}
                        disabled={saving === booking.id}
                        className="bg-[#0D0D3B] hover:bg-red-600 text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors"
                      >
                        {saving === booking.id ? '...' : 'Save'}
                      </button>
                    </div>
                  </div>

                  {/* Status update */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Update Status</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate(booking, 'completed')}
                        disabled={booking.status === 'completed'}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                          booking.status === 'completed'
                            ? 'bg-green-100 text-green-700 cursor-not-allowed'
                            : 'bg-green-50 hover:bg-green-100 text-green-700'
                        }`}
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(booking, 'cancelled')}
                        disabled={booking.status === 'cancelled'}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                          booking.status === 'cancelled'
                            ? 'bg-red-100 text-red-700 cursor-not-allowed'
                            : 'bg-red-50 hover:bg-red-100 text-red-700'
                        }`}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <p className="text-xs text-gray-400 mt-3">
          Showing {filtered.length} of {bookings.length} bookings
        </p>
      )}

    </AdminLayout>
  );
}