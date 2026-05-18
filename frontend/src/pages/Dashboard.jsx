import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createProduct, deleteProduct, fetchMyProducts } from '../services/productService';
import { fetchVendorProfile, fetchVendorReviews } from '../services/vendorService';
import api from '../services/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ title: '', description: '', price: '', image: '' });
  const [activeTab, setActiveTab] = useState('products');
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [ratingAvg, setRatingAvg] = useState(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchMyProducts();
      setProducts(data);
    } catch (err) {
      setMessage('Unable to load products.');
    } finally {
      setLoading(false);
    }
  };

  const refreshProducts = async () => {
    try {
      const data = await fetchMyProducts();
      setProducts(data);
    } catch (err) {
      // ignore background refresh failures
    }
  };

  const loadProfile = async () => {
    try {
      const data = await fetchVendorProfile();
      setProfile(data);
    } catch (err) {
      setProfile(null);
    }
  };

  useEffect(() => {
    loadProducts();
    loadProfile();

    const refreshTimer = setInterval(refreshProducts, 10000);
    return () => clearInterval(refreshTimer);
  }, []);

  // Poll reviews when profile is available
  useEffect(() => {
    let timer;
    const loadReviews = async () => {
      if (!profile?._id) return;
      setReviewsLoading(true);
      try {
        const data = await fetchVendorReviews(profile._id);
        setReviews(data || []);
        if (data && data.length) {
          const avg = data.reduce((s, r) => s + (r.rating || 0), 0) / data.length;
          setRatingAvg(Number(avg.toFixed(2)));
        } else {
          setRatingAvg(null);
        }
      } catch (err) {
        // ignore - maybe endpoint not available
      } finally {
        setReviewsLoading(false);
      }
    };

    loadReviews();
    timer = setInterval(loadReviews, 8000);
    return () => clearInterval(timer);
  }, [profile]);

  const handleFormChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = new FormData();
    data.append('file', file);
    try {
      setMessage('');
      const res = await api.post('/uploads', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm((f) => ({ ...f, image: res.data.url }));
    } catch (err) {
      setMessage('Image upload failed.');
    }
  };

  const handleCreateProduct = async (event) => {
    event.preventDefault();
    setMessage('');
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        image: form.image,
      };
      const product = await createProduct(payload);
      setProducts((current) => [product, ...current]);
      setForm({ title: '', description: '', price: '', image: '' });
      setMessage('Product added successfully.');
    } catch (err) {
      setMessage('Unable to add product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setMessage('');
    try {
      await deleteProduct(id);
      setProducts((current) => current.filter((product) => product._id !== id));
      setMessage('Product removed.');
    } catch (err) {
      setMessage('Unable to remove product.');
    }
  };

  const productCount = products.length;
  const totalProducts = useMemo(() => productCount, [productCount]);
  const storeInquiries = profile?.inquiryCount || 0;
  const productInquiries = useMemo(
    () => products.reduce((sum, product) => sum + (product.inquiryCount || 0), 0),
    [products]
  );
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
      <aside className="space-y-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">{getGreeting()}</p>
          <h2 className="text-2xl font-semibold text-slate-900">{user.name}</h2>
          <p className="text-sm text-slate-500">Role: {user.role}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-5 space-y-2">
          <p className="text-sm text-slate-500">Vendor storefront</p>
          <p className="mt-3 text-lg font-semibold text-slate-900">{profile?.businessName || 'No profile yet'}</p>
          <p className="text-sm text-slate-600">{profile?.category || 'Category missing'}</p>
          <p className="text-sm text-slate-600">{profile?.location || 'Location missing'}</p>
          <p className="text-sm text-slate-600">Contact: {profile?.ownerId?.email || user.email || 'No contact available'}</p>
        </div>
        <div className="space-y-3">
          <Link
            to="/vendor/profile"
            className="block rounded-3xl bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-indigo-700 h-12 flex items-center justify-center"
          >
            {profile ? 'Edit profile' : 'Create profile'}
          </Link>
          <button
            type="button"
            onClick={logout}
            className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 h-12 flex items-center justify-center"
          >
            Sign out
          </button>
          <nav className="space-y-2 pt-4">
            <a href="#overview" className="block rounded-3xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">Dashboard</a>
            <a href="#vendor-stats" className="block rounded-3xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">My Products</a>
            <a href="#product-management" className="block rounded-3xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">Add Product</a>
          </nav>
        </div>
      </aside>

      <section className="space-y-6">
        <div id="overview" className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Vendor Dashboard</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">Storefront overview</h1>
              <p className="mt-2 text-slate-600">
                Manage your marketplace presence, track product activity, and keep your storefront updated.
              </p>
            </div>
            {profile ? (
              <Link
                to={`/vendor-storefront/${profile._id}`}
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                View storefront
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center justify-center rounded-full bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-500"
              >
                View storefront
              </button>
            )}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl bg-slate-50 p-5 text-slate-900 flex flex-col justify-between min-h-[136px]">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Total products</p>
              <p className="text-3xl font-semibold">{totalProducts}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5 text-slate-900 flex flex-col justify-between min-h-[136px]">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Store visits</p>
              <p className="text-3xl font-semibold">{storeInquiries}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5 text-slate-900 flex flex-col justify-between min-h-[136px]">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Product inquiries</p>
              <p className="text-3xl font-semibold">{productInquiries}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5 text-slate-900 flex flex-col justify-between min-h-[136px]">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Average rating</p>
              <p className="text-3xl font-semibold">{ratingAvg != null ? ratingAvg : '—'}</p>
            </div>
          </div>
        </div>

        <div id="vendor-stats" className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Recent products</h2>
              <p className="mt-2 text-sm text-slate-600">Manage your product catalog and update status from one place.</p>
            </div>
            <button className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-200" onClick={() => document.getElementById('product-management')?.scrollIntoView({ behavior: 'smooth' })}>
              + Add product
            </button>
          </div>

          {message && <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{message}</div>}

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Availability</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-6 text-center text-slate-500">Loading products…</td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-6 text-center text-slate-500">No products yet. Add one below.</td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className="hover:bg-slate-50">
                      <td className="px-6 py-5">
                        <div className="font-medium text-slate-900">{product.title}</div>
                        <div className="mt-1 text-sm text-slate-500">{product.description}</div>
                        <div className="mt-2 text-xs text-slate-500">Inquiries: {product.inquiryCount || 0}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">₹{product.price}</td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">{product.status || 'Available'}</span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleDelete(product._id)}
                          className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 h-9 flex items-center justify-center"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div id="product-management" className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Add new product</h2>
              <p className="mt-2 text-sm text-slate-600">Add product details, pricing, and description for your storefront.</p>
            </div>
          </div>

          <form className="mt-6 grid gap-4 lg:grid-cols-2" onSubmit={handleCreateProduct}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-slate-700">Product title</label>
                <input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  required
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500"
                  placeholder="Haircut"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium text-slate-700">Price</label>
                <input
                  id="price"
                  name="price"
                  value={form.price}
                  onChange={handleFormChange}
                  required
                  type="number"
                  min="0"
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500"
                  placeholder="500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="imageFile" className="text-sm font-medium text-slate-700">Product image</label>
                <input id="imageFile" name="imageFile" type="file" accept="image/*" onChange={handleFileUpload} className="w-full text-sm text-slate-600" />
                {form.image && <img src={form.image} alt="preview" className="mt-2 h-32 w-32 rounded-lg object-cover" />}
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-slate-700">Short description</label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  rows="5"
                  required
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 resize-none"
                  placeholder="Professional haircut with expert styling and finishes."
                />
              </div>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ title: '', description: '', price: '', image: '' })}
                    className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 h-11 flex items-center justify-center"
                  >
                    Clear
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-3xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70 h-11"
                >
                  {saving ? 'Saving...' : 'Add product'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
