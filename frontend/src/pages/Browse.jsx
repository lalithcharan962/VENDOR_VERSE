import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllVendors } from '../services/browseService';

const Browse = () => {
  const [vendors, setVendors] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadVendors = async () => {
      try {
        const data = await fetchAllVendors();
        setVendors(data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Unable to load vendors: your session may have expired. Please login again.');
        } else {
          setError('Unable to load vendors.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadVendors();
  }, []);

  const formatCategory = (category) => {
    const normalized = (category || 'Other').trim().toLowerCase();
    return normalized
      .split(/\s+|[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const categories = useMemo(() => {
    const seen = new Map();
    vendors.forEach((vendor) => {
      const raw = vendor.category?.trim() || 'Other';
      const key = raw.toLowerCase();
      if (!seen.has(key)) {
        seen.set(key, raw);
      }
    });
    return ['All', ...Array.from(seen.values()).map((category) => formatCategory(category))];
  }, [vendors]);

  const normalizedLocation = searchLocation.trim().toLowerCase();

  const filteredVendors = useMemo(() => {
    const filtered = vendors.filter((vendor) => {
      const categoryMatch = selectedCategory === 'All' || vendor.category?.trim().toLowerCase() === selectedCategory.toLowerCase();
      return categoryMatch;
    });

    return filtered.sort((a, b) => {
      if (!normalizedLocation) {
        return a.businessName.localeCompare(b.businessName);
      }

      const aLocal = a.location?.toLowerCase().includes(normalizedLocation) ? 0 : 1;
      const bLocal = b.location?.toLowerCase().includes(normalizedLocation) ? 0 : 1;
      if (aLocal !== bLocal) {
        return aLocal - bLocal;
      }
      return a.businessName.localeCompare(b.businessName);
    });
  }, [vendors, selectedCategory, normalizedLocation]);

  const getVendorAverage = (vendor) => {
    if (vendor.averageRating) return vendor.averageRating;
    if (vendor.rating) return vendor.rating;
    if (vendor.reviews && vendor.reviews.length) {
      const total = vendor.reviews.reduce((s, r) => s + (r.rating || 0), 0);
      return Number((total / vendor.reviews.length).toFixed(1));
    }
    return null;
  };

  return (
    <section className="space-y-5">
      <div className="rounded-[1.25rem] bg-white p-4 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.45em] text-indigo-600">Customer marketplace</p>
            <h1 className="mt-2 text-xl font-semibold text-slate-900">Find local businesses close by.</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Search by category and location to surface nearby storefronts quickly.
            </p>
          </div>

          <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-3">
            <label className="text-sm font-medium text-slate-700">Your city</label>
            <input
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Enter your city"
              className="mt-3 w-full rounded-3xl border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none transition focus:border-indigo-500"
            />
            <button
              onClick={() => setSearchLocation(locationInput)}
              className="mt-4 w-full rounded-3xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Find nearby
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                selectedCategory === category ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {searchLocation && (
          <div className="mt-5 rounded-[1.75rem] border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-700">
            {filteredVendors.some((vendor) => vendor.location?.toLowerCase().includes(normalizedLocation)) ? (
              <span>
                Showing businesses near <span className="font-semibold text-slate-900">{searchLocation}</span> first.
              </span>
            ) : (
              <span>No exact matches for "{searchLocation}". Showing all vendors in the selected category.</span>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-[2rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div>
        {loading ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center text-slate-600">Loading vendors…</div>
        ) : filteredVendors.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center text-slate-600">
            No vendors match this category yet. Try another filter.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVendors.map((vendor) => (
              <Link
                key={vendor._id}
                to={`/vendor-storefront/${vendor._id}`}
                className="group overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative h-28 bg-slate-100">
                  {vendor.profilePhoto ? (
                    <img
                      src={vendor.profilePhoto}
                      alt={vendor.businessName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-100 via-slate-100 to-slate-200 text-xl text-indigo-600">
                      🏪
                    </div>
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-700 shadow-sm">
                    {vendor.category || 'General'}
                  </span>
                </div>

                <div className="space-y-2 p-3">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">{vendor.businessName}</h2>
                    <p className="mt-1 text-sm text-slate-500">{vendor.description || 'Fresh local products available now.'}</p>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
                    <div>
                      <p className="font-semibold text-slate-900">{vendor.location || 'Local area'}</p>
                      <p>{vendor.ownerId?.name || 'Local vendor'}</p>
                    </div>
                    {(() => {
                      const avg = getVendorAverage(vendor);
                      if (avg != null) {
                        return (
                          <span className="flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-indigo-700">
                            <span className="font-semibold">{avg}</span>
                            <span className="text-amber-400">{Array.from({ length: 5 }, (_, i) => (i < Math.round(avg) ? '★' : '☆')).join('')}</span>
                          </span>
                        );
                      }
                      return <span className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700">Open</span>;
                    })()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Browse;
