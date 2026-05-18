import { Link } from 'react-router-dom';
import heroImage from '../assets/chtgpt.png';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-6xl">
          <div className="grid gap-12 items-center lg:grid-cols-2">
            <div className="space-y-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">Welcome to VendorVerse</p>

                <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                  Empower your business, <span className="text-indigo-600">grow digitally</span>
                </h1>

                <p className="mt-8 text-lg text-slate-600 leading-relaxed max-w-2xl">
                  Connect with customers, build your storefront, and scale your business on a platform designed for local vendors. Join thousands of businesses already thriving on VendorVerse.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center px-8 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
                >
                  Get Started
                </Link>
                <Link
                  to="/browse"
                  className="inline-flex items-center px-8 py-3 rounded-lg border-2 border-indigo-600 text-indigo-600 font-semibold hover:bg-indigo-50 transition"
                >
                  Explore Businesses
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-lg">
              <img src={heroImage} alt="VendorVerse hero" className="h-full w-full object-cover rounded" />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
