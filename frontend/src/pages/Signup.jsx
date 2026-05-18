import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setSignupForm({ ...signupForm, [event.target.name]: event.target.value });
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    // Basic client-side validation to help catch common issues
    if (!signupForm.name || signupForm.name.length < 2) {
      setError('Please enter your full name (at least 2 characters).');
      setLoading(false);
      return;
    }
    if (!signupForm.email || !signupForm.email.includes('@')) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }
    if (!signupForm.password || signupForm.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const data = await registerUser(signupForm);
      login(data);
      navigate('/browse', { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Unable to create account. Please try again.';
      setError(message);
      console.error('Signup error:', err?.response || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-xl sm:px-10">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-indigo-600">VendorVerse</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Create your VendorVerse account
          </h1>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            Register once to browse local businesses, manage your profile, and add a storefront later.
          </p>
        </div>

        <form className="mt-10 space-y-5" onSubmit={handleSignup}>
          {error && (
            <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-slate-700">
              Full name
            </label>
            <input
              id="name"
              name="name"
              value={signupForm.name}
              onChange={handleChange}
              required
              className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500"
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              value={signupForm.email}
              onChange={handleChange}
              type="email"
              required
              className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500"
              placeholder="hello@vendorverse.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              value={signupForm.password}
              onChange={handleChange}
              type="password"
              required
              className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500"
              placeholder="Create password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-3xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 transition hover:text-indigo-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
