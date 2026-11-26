import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  KeyRound,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Smartphone,
  UserCheck,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getHomePathForRole } from '../../components/common/ProtectedRoute';

export const LoginPage: React.FC = () => {
  const {
    currentUser,
    loginWithEmail,
    loginWithDemoGoogle,
    loginWithDemoPhone,
    showToast,
  } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as
    | { from?: string; authNotice?: string }
    | null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Demo Phone OTP Simulation state
  const [showPhoneDemo, setShowPhoneDemo] = useState(false);
  const [phoneInput, setPhoneInput] = useState('+91 98000 10101');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  useEffect(() => {
    if (currentUser) {
      navigate(getHomePathForRole(currentUser.role), { replace: true });
    }
  }, [currentUser, navigate]);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }
    const res = loginWithEmail(email, password);
    if (res.error || !res.user) {
      setError(res.error || 'Authentication failed.');
      return;
    }
    showToast(
      `Welcome back, ${res.user.name}`,
      'success',
      `Signed in to ${res.user.role} portal.`
    );
    navigate(getHomePathForRole(res.user.role), { replace: true });
  };

  const handleQuickDemoLogin = (
    demoEmail: string,
    demoPassword: string,
    roleLabel: string
  ) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    const res = loginWithEmail(demoEmail, demoPassword);
    if (res.user) {
      showToast(
        `Demo ${roleLabel} Signed In`,
        'info',
        `Authenticated as ${res.user.email} (prototype demo account).`
      );
      navigate(getHomePathForRole(res.user.role), { replace: true });
    }
  };

  const handleGoogleDemo = () => {
    const user = loginWithDemoGoogle();
    showToast(
      'Google Demo Simulation',
      'info',
      `Signed in as demo client ${user.name}. Live Google OAuth is not active in this local prototype.`
    );
    navigate(getHomePathForRole(user.role), { replace: true });
  };

  const handleSendDemoOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneInput.replace(/\D/g, '').length < 7) {
      setError('Enter a valid phone number for the demo OTP simulation.');
      return;
    }
    setError('');
    setOtpSent(true);
    setOtpCode('123456');
    showToast(
      'Demo OTP Generated',
      'info',
      'Prototype simulation code 123456 pre-filled. No SMS was sent.'
    );
  };

  const handleVerifyDemoOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim() !== '123456') {
      setError('For this demo simulation, enter verification code 123456.');
      return;
    }
    const { user } = loginWithDemoPhone(phoneInput);
    showToast(
      'Phone Demo Simulation Signed In',
      'info',
      `Authenticated as client ${user.name} (local prototype simulation).`
    );
    navigate(getHomePathForRole(user.role), { replace: true });
  };

  return (
    <div className="min-h-[82vh] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 page-enter">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Standard Login + Demo Simulations */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="mb-6">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#3478F6]">
              <Lock className="w-3.5 h-3.5" />
              Portal Access
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-[#102A43]">
              Sign In to LocalLift
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Access your Client Dashboard, Team Workspace, or Admin Portal.
            </p>
          </div>

          {state?.authNotice && (
            <div className="mb-5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs font-medium text-amber-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>{state.authNotice}</span>
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-xs font-semibold text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.demo"
                  className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#3478F6] hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-xs"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Clearly Labelled Demo Simulations for Google & Phone */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Alternative Demo Sign-In Simulations
              </p>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                Simulated Only
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleDemo}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-[#102A43] transition-colors"
              >
                <span className="w-4 h-4 rounded-full bg-blue-100 text-[#3478F6] font-bold flex items-center justify-center text-[10px]">
                  G
                </span>
                <span>Google Login (Demo)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowPhoneDemo((v) => !v);
                  setError('');
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-[#102A43] transition-colors"
              >
                <Smartphone className="w-4 h-4 text-[#3478F6]" />
                <span>Phone OTP Login (Demo)</span>
              </button>
            </div>

            <p className="mt-2 text-[11px] text-slate-500">
              Note: Google and Phone OTP options simulate client authentication locally without live OAuth or SMS gateways.
            </p>

            {showPhoneDemo && (
              <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3 page-enter">
                {!otpSent ? (
                  <form onSubmit={handleSendDemoOtp} className="space-y-3">
                    <label className="block text-xs font-semibold text-[#102A43]">
                      Demo Phone Number
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white pl-8 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#102A43] text-white text-xs font-semibold hover:bg-[#1E3A5F]"
                      >
                        Send Demo OTP
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyDemoOtp} className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#102A43]">
                        Enter Simulated OTP
                      </span>
                      <span className="text-emerald-700 font-semibold">
                        Demo Code: 123456
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="123456"
                        className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#3478F6] text-white text-xs font-semibold hover:bg-blue-700"
                      >
                        Verify & Sign In
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          <p className="mt-6 text-xs text-center text-slate-600">
            New small business client?{' '}
            <Link
              to="/signup"
              className="font-semibold text-[#3478F6] hover:underline"
            >
              Create a Client Account
            </Link>
          </p>
        </div>

        {/* Right: 1-Click Demo Credentials Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-[#102A43] text-white p-6 shadow-md">
            <p className="text-xs font-bold uppercase tracking-wider text-[#FF9F1C]">
              Presentation Demo Accounts
            </p>
            <h2 className="mt-1 text-lg font-bold">
              One-Click Role Switching
            </h2>
            <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
              Use these demonstration credentials to showcase all three LocalLift environments. These accounts are strictly for prototype evaluation.
            </p>

            <div className="mt-5 space-y-3">
              {/* Client Demo */}
              <div className="rounded-xl bg-white/10 border border-white/15 p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#FF9F1C]" />
                    <span className="text-sm font-bold">Client Account</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/30 text-blue-100 font-semibold">
                    Sunrise Café
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-slate-300 font-mono">
                  client@locallift.demo / Client123!
                </p>
                <button
                  type="button"
                  onClick={() =>
                    handleQuickDemoLogin(
                      'client@locallift.demo',
                      'Client123!',
                      'Client'
                    )
                  }
                  className="mt-3 w-full py-2 rounded-lg bg-[#3478F6] hover:bg-blue-600 text-white text-xs font-semibold transition-colors"
                >
                  Login as Client
                </button>
              </div>

              {/* Team Demo */}
              <div className="rounded-xl bg-white/10 border border-white/15 p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#FF9F1C]" />
                    <span className="text-sm font-bold">Team Member</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 font-semibold">
                    Aarav Mehta
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-slate-300 font-mono">
                  team@locallift.demo / Team123!
                </p>
                <button
                  type="button"
                  onClick={() =>
                    handleQuickDemoLogin(
                      'team@locallift.demo',
                      'Team123!',
                      'Team Member'
                    )
                  }
                  className="mt-3 w-full py-2 rounded-lg bg-[#FF9F1C] hover:bg-[#e88b0c] text-[#102A43] text-xs font-bold transition-colors"
                >
                  Login as Team Member
                </button>
              </div>

              {/* Admin Demo */}
              <div className="rounded-xl bg-white/10 border border-white/15 p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#FF9F1C]" />
                    <span className="text-sm font-bold">Agency Admin</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/15 text-white font-semibold">
                    Private Portal
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-slate-300 font-mono">
                  admin@locallift.demo / Admin123!
                </p>
                <button
                  type="button"
                  onClick={() =>
                    handleQuickDemoLogin(
                      'admin@locallift.demo',
                      'Admin123!',
                      'Admin'
                    )
                  }
                  className="mt-3 w-full py-2 rounded-lg bg-white text-[#102A43] hover:bg-slate-100 text-xs font-bold transition-colors"
                >
                  Login as Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
