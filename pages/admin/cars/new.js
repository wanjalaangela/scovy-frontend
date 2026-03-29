import { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import api from '../../../lib/api';

export default function NewCar() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    mileage: '',
    engine: '',
    transmission: 'automatic',
    fuel_type: 'petrol',
    color: '',
    price: '',
    description: '',
    condition: 'used',
    is_available: true,
    is_featured: false,
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/cars/', formData);
      const carId = res.data.id;
      if (images.length > 0) {
        const fd = new FormData();
        images.filter(Boolean).forEach(img => fd.append('images', img));
        await api.post(`/api/cars/${carId}/upload_images/`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      router.push('/admin/cars');
    } catch (err) {
      setError('Failed to create car. Please check all fields and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Add New Car">
      <div className="max-w-3xl">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl mb-6 text-sm font-medium">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-black text-[#0D0D3B] mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Make *</label>
                <input type="text" name="make" value={formData.make} onChange={handleChange} required placeholder="e.g. Toyota" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Model *</label>
                <input type="text" name="model" value={formData.model} onChange={handleChange} required placeholder="e.g. Land Cruiser" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Year *</label>
                <input type="number" name="year" value={formData.year} onChange={handleChange} required placeholder="e.g. 2020" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mileage (km) *</label>
                <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} required placeholder="e.g. 50000" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Engine *</label>
                <input type="text" name="engine" value={formData.engine} onChange={handleChange} required placeholder="e.g. 4.0L V6" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Color *</label>
                <input type="text" name="color" value={formData.color} onChange={handleChange} required placeholder="e.g. White" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Price (KES) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required placeholder="e.g. 4500000" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Transmission *</label>
                <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 bg-white">
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Fuel Type *</label>
                <select name="fuel_type" value={formData.fuel_type} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 bg-white">
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Condition *</label>
                <select name="condition" value={formData.condition} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 bg-white">
                  <option value="used">Used</option>
                  <option value="new">New</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Full car description..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 resize-none" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-black text-[#0D0D3B] mb-4">Settings</h2>
            <div className="flex gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="is_available" checked={formData.is_available} onChange={handleChange} className="w-4 h-4 accent-red-600" />
                <span className="text-sm font-semibold text-[#0D0D3B]">Available for sale</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} className="w-4 h-4 accent-red-600" />
                <span className="text-sm font-semibold text-[#0D0D3B]">Featured on homepage</span>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-black text-[#0D0D3B] mb-2">Images</h2>
            <p className="text-xs text-gray-400 mb-4">Upload up to 5 images. The first image will be the cover photo.</p>
            <div className="grid grid-cols-5 gap-3 mb-4">
              {[0, 1, 2, 3, 4].map(index => (
                <div
                  key={index}
                  className={`relative aspect-square rounded-xl border-2 border-dashed overflow-hidden flex items-center justify-center cursor-pointer transition-colors ${
                    images[index] ? 'border-red-400' : 'border-gray-200 hover:border-red-300'
                  }`}
                  onClick={() => document.getElementById(`image-input-${index}`).click()}
                >
                  {images[index] ? (
                    <>
                      <img
                        src={URL.createObjectURL(images[index])}
                        alt={`Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newImages = [...images];
                          newImages[index] = null;
                          setImages(newImages);
                        }}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full text-xs flex items-center justify-center"
                      >
                        x
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded">
                          Cover
                        </span>
                      )}
                    </>
                  ) : (
                    <div className="text-center">
                      <p className="text-2xl text-gray-300">+</p>
                      <p className="text-xs text-gray-400 mt-1">{index === 0 ? 'Cover' : `Photo ${index + 1}`}</p>
                    </div>
                  )}
                  <input
                    id={`image-input-${index}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        const newImages = [...images];
                        newImages[index] = e.target.files[0];
                        setImages(newImages);
                      }
                    }}
                  />
                </div>
              ))}
            </div>
            {images.filter(Boolean).length > 0 && (
              <p className="text-xs text-green-600 font-semibold">{images.filter(Boolean).length} image{images.filter(Boolean).length > 1 ? 's' : ''} selected</p>
            )}
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className={`px-8 py-3.5 font-black text-sm tracking-widest rounded-xl transition-colors ${loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}`}>
              {loading ? 'SAVING...' : 'SAVE CAR'}
            </button>
            <button type="button" onClick={() => router.push('/admin/cars')} className="px-8 py-3.5 font-black text-sm tracking-widest rounded-xl border-2 border-gray-200 hover:border-gray-300 text-gray-600 transition-colors">
              CANCEL
            </button>
          </div>

        </form>
      </div>
    </AdminLayout>
  );
}