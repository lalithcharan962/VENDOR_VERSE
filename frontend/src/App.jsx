import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Browse from './pages/Browse';
import VendorProfile from './pages/VendorProfile';
import VendorStorefront from './pages/VendorStorefront';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user, logout } = useAuth();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <Link to="/" className="text-2xl font-extrabold tracking-tight text-slate-900">VendorVerse</Link>
                <nav className="hidden gap-6 text-sm text-slate-600 lg:flex">
                  <Link to="/" className="rounded-full px-3 py-2 text-sm font-medium hover:bg-slate-100 transition">Home</Link>
                  <Link to="/browse" className="rounded-full px-3 py-2 text-sm font-medium hover:bg-slate-100 transition">Browse</Link>
                  {user && (
                    <Link to="/dashboard" className="rounded-full px-3 py-2 text-sm font-medium hover:bg-slate-100 transition">Dashboard</Link>
                  )}
                  <a href="#about" className="rounded-full px-3 py-2 text-sm font-medium hover:bg-slate-100 transition">About</a>
                </nav>
              </div>

              <div className="flex items-center gap-3">
                {user ? (
                  <>
                    <span className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-700">Welcome, {user.name || user.email || 'Member'}</span>
                    <button onClick={logout} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="rounded-full px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100">Login</Link>
                    <Link to="/signup" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">Sign Up</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/vendor/profile" element={<ProtectedRoute><VendorProfile /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/vendor-storefront/:vendorId" element={<VendorStorefront />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
