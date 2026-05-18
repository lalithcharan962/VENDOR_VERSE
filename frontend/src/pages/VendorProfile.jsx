import { useEffect, useState } from 'react';
import { fetchVendorProfile, createVendorProfile, updateVendorProfile } from '../services/vendorService';
import api from '../services/api';

const VendorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ businessName: '', category: '', location: '', phoneNumber: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchVendorProfile();
        setProfile(data);
        setForm({
          businessName: data.businessName,
          category: data.category,
          location: data.location,
          phoneNumber: data.phoneNumber || '',
          description: data.description,
        });
      } catch (err) {
        setProfile(null);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleFile = async (e, field = 'profilePhoto') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = new FormData();
    data.append('file', file);
    try {
      const res = await api.post('/uploads', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm((f) => ({ ...f, [field]: res.data.url }));
    } catch (err) {
      setMessage('Failed to upload image.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const result = profile ? await updateVendorProfile(form) : await createVendorProfile(form);
      setProfile(result);
      setMessage('Vendor profile saved successfully. Your changes are live!');
    } catch (err) {
      setMessage('Unable to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Vendor Profile</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">{profile ? 'Update your store' : 'Create your store'}</h1>
          <p className="mt-2 text-slate-600">Share your business details and set up your storefront for customers.</p>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {message && <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{message}</div>}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Business name</label>
            <input
              name="businessName"
              value={form.businessName}
              onChange={handleChange}
              required
              className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-indigo-500"
              placeholder="Lalith’s Crafts"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Category</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-indigo-500"
              placeholder="Home Decor"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-indigo-500"
              placeholder="Chennai, India"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Phone number</label>
            <input
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              type="tel"
              className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-indigo-500"
              placeholder="+91 98765 43210"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Profile photo</label>
            <input type="file" accept="image/*" onChange={(e) => handleFile(e, 'profilePhoto')} className="w-full text-sm text-slate-600" />
            {form.profilePhoto && <img src={form.profilePhoto} alt="profile" className="mt-2 h-24 w-24 rounded-lg object-cover" />}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">About your business</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              required
              className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-indigo-500 resize-none"
              placeholder="Tell customers what your store offers, your specialty, and why they should choose you."
            />
            <p className="text-xs text-slate-500">This text appears on your storefront as the shop's About section.</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex rounded-3xl bg-indigo-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70 h-11 items-center justify-center"
        >
          {loading ? 'Saving...' : profile ? 'Update profile' : 'Create profile'}
        </button>
      </form>
    </div>
  );
};

export default VendorProfile;
