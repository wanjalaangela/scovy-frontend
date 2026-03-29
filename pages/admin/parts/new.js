import { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import api from '../../../lib/api';

export default function NewPart() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    category: 'engine',
    description: '',
    compatible_makes: '',
    compatible_models: '',
    compatible_years: '',
    price: '',
    stock_quantity: '',
    condition: 'new',
    part_number: '',
    is_active: true,
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleImages = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/api/parts/', formData);
      const partId = res.data.id;

      if (images.length > 0) {
        const formDataImages = new FormData();
        images.forEach(img => formDataImages.append('images', img));
        await api.post(`/api/parts/${partId}/upload_images/`, formDataImages, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      router.push('/admin/parts');
    } catch (err) {
      setError('Failed to create part. Please check all fields and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Add New Spare Part">
      <div className="max-w-3xl">

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-black text-[#0D0D3B] mb-4">Part Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Part Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Brake Pad Set" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 bg-white">
                  <option value="engine">Engine Parts</option>
                  <option value="brakes">Brake Pads</option>
                  <option value="suspension">Suspension</option>
                  <option value="filters">Filters</option>
                  <option value="accessories">Accessories</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Condition *</label>
                <select name="condition" value={formData.condition} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 bg-white">
                  <option value="new">New</option>
                  <option value="used">Used</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Price (KES) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required placeholder="e.g. 8500" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Stock Quantity *</label>
                <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} required placeholder="e.g. 10" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Part Number</label>
                <input type="text" name="part_number" value={formData.part_number} onChange={handleChange} placeholder="e.g. BP-4234" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Compatible Makes</label>
                <input type="text" name="compatible_makes" value={formData.compatible_makes} onChange={handleChange} placeholder="e.g. Toyota, Nissan" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Compatible Models</label>
                <input type="text" name="compatible_models" value={formData.compatible_models} onChange={handleChange} placeholder="e.g. Land Cruiser, Hilux" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Compatible Years</label>
                <input type="text" name="compatible_years" value={formData.compatible_years} onChange={handleChange} placeholder="e.g. 2015-2022" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} placeholder="Full part description..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 resize-none" />
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-black text-[#0D0D3B] mb-4">Settings</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="w-4 h-4 accent-red-600" />
              <span className="text-sm font-semibold text-[#0D0D3B]">Active — visible in store</span>
            </label>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-black text-[#0D0D3B] mb-4">Images</h2>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImages}
              className="w-full border border-dashed border-gray-300 rounded-xl px-4 py-6 text-sm text-gray-500 cursor-pointer hover:border-red-400 transition-colors"
            />
            {images.length > 0 && (
              <p className="text-xs text-green-600 font-semibold mt-2">{images.length} image{images.length > 1 ? 's' : ''} selected</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3.5 font-black text-sm tracking-widest rounded-xl transition-colors ${
                loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {loading ? 'SAVING...' : 'SAVE PART'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/parts')}
              className="px-8 py-3.5 font-black text-sm tracking-widest rounded-xl border-2 border-gray-200 hover:border-gray-300 text-gray-600 transition-colors"
            >
              CANCEL
            </button>
          </div>

        </form>
      </div>
    </AdminLayout>
  );
}