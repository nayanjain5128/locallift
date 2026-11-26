import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { UserRole } from '../../types';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export function getHomePathForRole(role: UserRole): string {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'team') return '/team/dashboard';
  return '/client/dashboard';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const { currentUser } = useApp();
  const location = useLocation();

  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname, authNotice: 'Please log in to access this portal.' }}
      />
    );
  }

  if (!allowedRoles.includes(currentUser.role)) {
    const redirectPath = getHomePathForRole(currentUser.role);
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-[#102A43]">Access Restricted</h1>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Your signed-in account (<span className="font-semibold capitalize">{currentUser.role}</span>) does not have permission to open{' '}
            <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">{location.pathname}</code>.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={redirectPath}
              className="px-5 py-2.5 rounded-xl bg-[#102A43] text-white text-sm font-semibold hover:bg-[#1E3A5F] transition-colors"
            >
              Go to My Dashboard
            </Link>
            <Link
              to="/"
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Public Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
