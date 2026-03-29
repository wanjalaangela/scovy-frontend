import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../../components/AdminLayout';
import api from '../../../../lib/api';

export default function EditCar() {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    if (!id) return;
    api.get(`/api/cars/${id}/`)
      .then(res => setFormData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      await api.patch(`/api/cars/${id}/`, {
        make: formData.make,
        model: formData.model,
        year: formData.year,
        mileage: formData.mileage,
        engine: formData.engine,
        transmission: formData.transmission,
        fuel_type: formData.fuel_type,
        color: formData.color,
        price: formData.price,
        description: formData.description,
        condition: formData.condition,
        is_available: formData.is_available,
        is_featured: formData.is_featured,
      });

      if (newImages.filter(Boolean).length > 0) {
        const fd = new FormData();
        newImages.filter(Boolean).forEach(img => fd.append('images', img));
        await api.post(`/api/cars/${id}/upload_images/`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setSuccess('Car updated successfully.');
      setTimeout(() => router.push('/admin/cars'), 1000);
    } catch (err) {
      setError('Failed to update car. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Car">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (!formData) return null;

  return (
    <AdminLayout title={`Edit — ${formData.year} ${formData.make} ${formData.model}`}>
      <div className="max-w-3xl">

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl mb-6 text-sm font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-xl mb-6 text-sm font-medium">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-black text-[#0D0D3B] mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Make *</label>
                <input type="text" name="make" value={formData.make} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Model *</label>
                <input type="text" name="model" value={formData.model} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Year *</label>
                <input type="number" name="year" value={formData.year} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mileage (km) *</label>
                <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Engine *</label>
                <input type="text" name="engine" value={formData.engine} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Color *</label>
                <input type="text" name="color" value={formData.color} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Price (KES) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" />
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
              <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 resize-none" />
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
            <h2 className="font-black text-[#0D0D3B] mb-2">Current Images</h2>
            {formData.images && formData.images.length > 0 ? (
              <div className="flex gap-3 flex-wrap mb-4">
                {formData.images.map((img, i) => (
                  <div key={img.id} className="relative w-20 h-16 rounded-lg overflow-hidden border border-gray-200">
                    <img src={img.image} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                    {i === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs text-center py-0.5">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 mb-4">No images yet.</p>
            )}

            <h3 className="font-bold text-[#0D0D3B] text-sm mb-2">Add More Images</h3>
            <div className="grid grid-cols-5 gap-3">
              {[0, 1, 2, 3, 4].map(index => (
                <div
                  key={index}
                  className={`relative aspect-square rounded-xl border-2 border-dashed overflow-hidden flex items-center justify-center cursor-pointer transition-colors ${
                    newImages[index] ? 'border-red-400' : 'border-gray-200 hover:border-red-300'
                  }`}
                  onClick={() => document.getElementById(`new-image-input-${index}`).click()}
                >
                  {newImages[index] ? (
                    <>
                      <img src={URL.createObjectURL(newImages[index])} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const imgs = [...newImages];
                          imgs[index] = null;
                          setNewImages(imgs);
                        }}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full text-xs flex items-center justify-center"
                      >
                        x
                      </button>
                    </>
                  ) : (
                    <div className="text-center">
                      <p className="text-2xl text-gray-300">+</p>
                    </div>
                  )}
                  <input
                    id={`new-image-input-${index}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        const imgs = [...newImages];
                        imgs[index] = e.target.files[0];
                        setNewImages(imgs);
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className={`px-8 py-3.5 font-black text-sm tracking-widest rounded-xl transition-colors ${saving ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}`}>
              {saving ? 'SAVING...' : 'SAVE CHANGES'}
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