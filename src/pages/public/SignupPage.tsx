import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Shield, UserPlus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BUSINESS_CATEGORIES } from '../../data/seedData';
import { getHomePathForRole } from '../../components/common/ProtectedRoute';

export const SignupPage: React.FC = () => {
  const { currentUser, signupClient, showToast } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState(
    BUSINESS_CATEGORIES[0]
  );
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      navigate(getHomePathForRole(currentUser.role), { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (
      !name.trim() ||
      !businessName.trim() ||
      !email.trim() ||
      !password
    ) {
      setError('Please fill in all required account fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const res = signupClient({
      name,
      email,
      password,
      businessName,
      businessCategory,
      phone,
      location,
    });

    if (res.error || !res.user) {
      setError(res.error || 'Could not create client account.');
      return;
    }

    showToast(
      'Client Account Created',
      'success',
      `Welcome to LocalLift, ${res.user.name}!`
    );
    navigate('/client/dashboard', { replace: true });
  };

  return (
    <div className="min-h-[82vh] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 page-enter">
      <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#3478F6]">
            <UserPlus className="w-3.5 h-3.5" />
            Client Registration
          </span>
          <h1 className="mt-2 text-2xl font-bold text-[#102A43]">
            Create Your Business Client Account
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Track service enquiries, view milestone progress, and receive agency updates in one portal.
          </p>
        </div>

        <div className="mb-5 rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 flex items-start gap-2.5 text-xs text-slate-600">
          <Shield className="w-4 h-4 text-[#3478F6] shrink-0 mt-0.5" />
          <span>
            Public signup creates a standard <strong>Client</strong> account only. Admin and Team accounts are provisioned internally.
          </span>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-xs font-semibold text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Owner / Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Business Name *
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g., FreshBite Bakery"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@business.example"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Business Category
              </label>
              <select
                value={businessCategory}
                onChange={(e) => setBusinessCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
              >
                {BUSINESS_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98000 00000"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                City / Location (Optional)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Bengaluru"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Password *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#3478F6] hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
          >
            <span>Create Client Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-5 text-xs text-center text-slate-600">
          Already registered?{' '}
          <Link
            to="/login"
            className="font-semibold text-[#3478F6] hover:underline"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};
