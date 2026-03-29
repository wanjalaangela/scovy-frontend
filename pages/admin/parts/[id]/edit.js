import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../../components/AdminLayout';
import api from '../../../../lib/api';

export default function EditPart() {
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
    api.get(`/api/parts/${id}/`)
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
      await api.patch(`/api/parts/${id}/`, {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        compatible_makes: formData.compatible_makes,
        compatible_models: formData.compatible_models,
        compatible_years: formData.compatible_years,
        price: formData.price,
        stock_quantity: formData.stock_quantity,
        condition: formData.condition,
        part_number: formData.part_number,
        is_active: formData.is_active,
      });

      if (newImages.filter(Boolean).length > 0) {
        const fd = new FormData();
        newImages.filter(Boolean).forEach(img => fd.append('images', img));
        await api.post(`/api/parts/${id}/upload_images/`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setSuccess('Part updated successfully.');
      setTimeout(() => router.push('/admin/parts'), 1000);
    } catch (err) {
      setError('Failed to update part. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Part">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (!formData) return null;

  return (
    <AdminLayout title={`Edit — ${formData.name}`}>
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
            <h2 className="font-black text-[#0D0D3B] mb-4">Part Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Part Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" />
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
                <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Stock Quantity *</label>
                <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Part Number</label>
                <input type="text" name="part_number" value={formData.part_number || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Compatible Makes</label>
                <input type="text" name="compatible_makes" value={formData.compatible_makes || ''} onChange={handleChange} placeholder="e.g. Toyota, Nissan" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Compatible Models</label>
                <input type="text" name="compatible_models" value={formData.compatible_models || ''} onChange={handleChange} placeholder="e.g. Land Cruiser, Hilux" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Compatible Years</label>
                <input type="text" name="compatible_years" value={formData.compatible_years || ''} onChange={handleChange} placeholder="e.g. 2015-2022" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description *</label>
              <textarea name="description" value={formData.description || ''} onChange={handleChange} required rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 resize-none" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-black text-[#0D0D3B] mb-4">Settings</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="w-4 h-4 accent-red-600" />
              <span className="text-sm font-semibold text-[#0D0D3B]">Active — visible in store</span>
            </label>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-black text-[#0D0D3B] mb-2">Current Images</h2>
            {formData.images && formData.images.length > 0 ? (
              <div className="flex gap-3 flex-wrap mb-4">
                {formData.images.map((img, i) => (
                  <div key={img.id} className="relative w-20 h-16 rounded-lg overflow-hidden border border-gray-200">
                    <img src={img.image} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
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
                  onClick={() => document.getElementById(`part-image-${index}`).click()}
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
                    id={`part-image-${index}`}
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
            <button type="button" onClick={() => router.push('/admin/parts')} className="px-8 py-3.5 font-black text-sm tracking-widest rounded-xl border-2 border-gray-200 hover:border-gray-300 text-gray-600 transition-colors">
              CANCEL
            </button>
          </div>

        </form>
      </div>
    </AdminLayout>
  );
}
