import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ArrowRight, LogOut, Menu, User as UserIcon, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../common/BrandLogo';
import { getHomePathForRole } from '../common/ProtectedRoute';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Services' },
  { to: '/our-work', label: 'Our Work' },
  { to: '/contact', label: 'Contact & Help' },
];

export const PublicLayout: React.FC = () => {
  const { currentUser, logout } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const portalPath = currentUser ? getHomePathForRole(currentUser.role) : '/login';

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#102A43]">
      {/* Top Navbar — Admin links are strictly excluded from public navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <BrandLogo to="/" />

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[#3478F6] bg-blue-50/80 font-semibold'
                      : 'text-slate-600 hover:text-[#102A43] hover:bg-slate-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2.5">
            {currentUser ? (
              <>
                <Link
                  to={portalPath}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#102A43] text-white text-sm font-semibold hover:bg-[#1E3A5F] transition-colors shadow-xs"
                >
                  <UserIcon className="w-4 h-4 text-[#FF9F1C]" />
                  <span>My Dashboard</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-[#102A43] hover:bg-slate-50 text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-[#102A43] hover:bg-slate-100 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3478F6] text-white text-sm font-semibold hover:bg-blue-700 transition-all shadow-xs"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 page-enter">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                    isActive
                      ? 'bg-blue-50 text-[#3478F6] font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {currentUser ? (
                <>
                  <Link
                    to={portalPath}
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center px-4 py-2.5 rounded-xl bg-[#102A43] text-white text-sm font-semibold"
                  >
                    Open My Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                      navigate('/');
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center px-4 py-2.5 rounded-xl border border-slate-200 text-[#102A43] text-sm font-semibold"
                  >
                    Login
                  </Link>
                  <Link
                    to="/services"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center px-4 py-2.5 rounded-xl bg-[#3478F6] text-white text-sm font-semibold"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Professional Footer */}
      <footer className="bg-[#102A43] text-slate-300 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <BrandLogo to="/" darkText={false} showTagline />
              <p className="mt-4 text-sm text-slate-300 max-w-md leading-relaxed">
                LocalLift helps small and neighborhood businesses build credible websites, manage social media consistently, and reach nearby customers online.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-amber-300 border border-white/10">
                Interactive Prototype • LocalStorage Persistence
              </span>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
                Explore
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-white transition-colors">
                    Services & Package Builder
                  </Link>
                </li>
                <li>
                  <Link to="/our-work" className="hover:text-white transition-colors">
                    Our Work
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors">
                    Contact & Help
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
                Client Access & Placeholders
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/login" className="hover:text-white transition-colors">
                    Portal Login
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-white transition-colors">
                    Client Registration
                  </Link>
                </li>
                <li className="pt-2 text-xs text-slate-400">
                  Email: contact@locallift.example (Placeholder)
                </li>
                <li className="text-xs text-slate-400">
                  Phone: +91 00000 00000 (Placeholder)
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} LocalLift. Your Business. Our Digital Drive.</p>
            <p>Demonstration prototype — No live payments or external APIs connected.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
