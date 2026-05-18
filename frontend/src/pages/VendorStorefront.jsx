import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchVendorById, fetchVendorProducts } from '../services/browseService';
import { fetchVendorReviews, postVendorReview } from '../services/vendorService';

const VendorStorefront = () => {
  const { vendorId } = useParams();
  const { user } = useAuth();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [actionMessage, setActionMessage] = useState('');
  const [inlineMessage, setInlineMessage] = useState('');

  const averageRating = useMemo(() => {
    if (!reviews.length) return null;
    const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return Number((total / reviews.length).toFixed(1));
  }, [reviews]);

  const ratingCount = reviews.length;
  const canReview = user?.role !== 'vendor';
  const formatINR = (value) => {
    const n = Number(value || 0);
    return n.toLocaleString('en-IN');
  };

  useEffect(() => {
    const loadVendorData = async () => {
      try {
        const vendorData = await fetchVendorById(vendorId);
        setVendor(vendorData);

        const productsData = await fetchVendorProducts(vendorId);
        setProducts(productsData);
      } catch (err) {
        setError('Unable to load vendor details.');
      } finally {
        setLoading(false);
      }
    };

    async function loadReviewData() {
      try {
        const reviewData = await fetchVendorReviews(vendorId);
        setReviews(reviewData);
      } catch (err) {
        console.warn('Unable to load vendor reviews.', err);
      }
    }

    loadVendorData();
    loadReviewData();

    return () => {
      setReviewMessage('');
      setSelectedProduct(null);
    };
  }, [vendorId]);

  const showAction = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(''), 3500);
  };


  const handleReviewChange = (event) => {
    const { name, value } = event.target;
    setReviewForm((current) => ({
      ...current,
      [name]: name === 'rating' ? Number(value) : value,
    }));
  };

  const handleSubmitReview = async (event) => {
    event.preventDefault();
    setReviewMessage('');

    if (!reviewForm.rating || reviewForm.rating < 1 || reviewForm.rating > 5) {
      setReviewMessage('Please choose a rating from 1 to 5 stars.');
      return;
    }

    try {
      await postVendorReview(vendorId, reviewForm);
      const reviewData = await fetchVendorReviews(vendorId);
      setReviews(reviewData);
      setReviewForm({ rating: 5, comment: '' });
      setReviewMessage('Thanks for rating this store.');
    } catch (err) {
      setReviewMessage('Unable to submit rating. Please try again.');
    }
  };

  if (loading) {
    return (
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center text-slate-600">
        Loading storefront…
      </section>
    );
  }

  if (error || !vendor) {
    return (
      <section className="rounded-[2rem] border border-red-200 bg-red-50 px-4 py-3 text-center text-red-700">
        {error || 'Vendor not found'}
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between gap-4 rounded-[1.75rem] bg-white p-5 shadow-sm border border-slate-200">
        <Link to="/browse" className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-800">← Back to browse</Link>
        <span className="text-sm text-slate-500">View vendor details</span>
      </div>

      <div className="rounded-[1.5rem] bg-gradient-to-br from-indigo-600 to-indigo-700 p-5 text-white shadow-lg">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-white/20 p-1.5">
            {vendor.profilePhoto ? (
              <img src={vendor.profilePhoto} alt={vendor.businessName} className="h-12 w-12 rounded-full object-cover" />
            ) : (
              <div className="text-3xl">🏪</div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-[11px] uppercase tracking-[0.35em] text-indigo-100">{vendor.category}</p>
            <h1 className="mt-2 text-2xl font-semibold">{vendor.businessName}</h1>
            {averageRating != null ? (
              <p className="mt-2 flex items-center gap-2 text-sm text-indigo-100">
                <span className="font-semibold">{averageRating}</span>
                <span className="text-amber-200">{Array.from({ length: 5 }, (_, index) => (index < Math.round(averageRating) ? '★' : '☆')).join('')}</span>
                <span className="text-slate-200">({ratingCount} review{ratingCount === 1 ? '' : 's'})</span>
              </p>
            ) : (
              <p className="mt-2 text-sm text-indigo-100">No ratings yet. Be the first to rate this business.</p>
            )}
          </div>
        </div>
        <p className="mt-4 text-sm leading-5 text-indigo-100">{vendor.description}</p>
        <div className="mt-3 flex flex-col gap-2 text-sm text-indigo-200 sm:flex-row sm:items-center sm:gap-4">
          <span>📍 {vendor.location}</span>
          {vendor.phoneNumber && <span>📞 {vendor.phoneNumber}</span>}
        </div>
      </div>

      {actionMessage && (
        <div className="mt-4 rounded-full bg-emerald-50 border border-emerald-100 px-4 py-2 text-sm text-emerald-700 shadow-sm w-full max-w-3xl">
          {actionMessage}
        </div>
      )}

      <div>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Products & Services</h2>
        </div>
        {products.length === 0 ? (
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 text-center text-slate-600">
            No products listed yet.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product._id}
                className="rounded-[1.5rem] border border-slate-200 bg-white shadow-sm hover:shadow-md transition overflow-hidden"
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.title}
                    onClick={() => setSelectedProduct(product)}
                    className="h-36 w-full cursor-pointer object-cover"
                  />
                ) : (
                  <div
                    onClick={() => setSelectedProduct(product)}
                    className="flex h-36 items-center justify-center bg-slate-100 text-slate-500"
                  >
                    View details
                  </div>
                )}
                <div className="p-4">
                  <div className="mb-2 text-[11px] uppercase tracking-[0.32em] text-slate-500">Product / Service</div>
                  <h3 className="text-base font-semibold text-slate-900">{product.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{product.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-lg font-bold text-indigo-600">₹{formatINR(product.price)}</p>
                    <button
                      type="button"
                      onClick={() => showAction('Feature currently not available — coming soon')}
                      className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
                    >
                      {product.type ? `Book ${product.type}` : 'Book'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <div className="rounded-[1.25rem] border border-indigo-200 bg-indigo-50 p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-indigo-700">About this item</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">{selectedProduct.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">{selectedProduct.description}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className="rounded-full border border-indigo-300 bg-white px-3 py-1 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
            >
              Close
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center gap-6">
                  <p className="text-sm text-slate-500">Price</p>
                  <p className="text-2xl font-semibold text-indigo-600">₹{formatINR(selectedProduct.price)}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <p className="text-sm text-slate-500">&nbsp;</p>
              <button
                type="button"
                onClick={() => showAction('Feature currently not available — coming soon')}
                className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                {selectedProduct.type ? `Book ${selectedProduct.type}` : 'Book'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Overall Rating</h2>
            <p className="mt-1 text-sm text-slate-600">Average of customer ratings</p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-3">
              <span className="text-3xl font-bold text-indigo-600">{averageRating != null ? averageRating : '—'}</span>
              <span className="text-sm text-slate-500">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-700">Share your experience</p>
            <div className="mt-2 flex items-center gap-2 text-2xl text-amber-400">
              {Array.from({ length: 5 }, (_, index) => {
                const starIndex = index + 1;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={async () => {
                      if (!user) {
                        showAction('Please log in to rate this business.');
                        return;
                      }
                      try {
                        await postVendorReview(vendorId, { rating: starIndex, comment: '' });
                        const updated = await fetchVendorReviews(vendorId);
                        setReviews(updated);
                        setInlineMessage('Thanks — your rating was recorded.');
                        setTimeout(() => setInlineMessage(''), 3500);
                        showAction('Thanks for rating this business.');
                      } catch (err) {
                        showAction('Unable to submit rating. Try again later.');
                      }
                    }}
                    className="transition hover:text-amber-500"
                  >
                    {averageRating != null && starIndex <= Math.round(averageRating) ? '★' : '☆'}
                  </button>
                );
              })}
            </div>
            {inlineMessage && <p className="mt-2 text-sm text-emerald-700">{inlineMessage}</p>}
          </div>

          <div className="mt-2 sm:mt-0 text-sm text-slate-500">
            {user ? (
              <span>Thanks — your rating updates the overall score.</span>
            ) : (
              <span>Please log in to leave a rating.</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VendorStorefront;
