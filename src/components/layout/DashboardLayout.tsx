import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  Bell,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../common/BrandLogo';
import { StatusBadge } from '../common/StatusBadge';

export interface SidebarNavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  badgeCount?: number;
}

interface DashboardLayoutProps {
  portalTitle: string;
  navItems: SidebarNavItem[];
  notificationLink?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  portalTitle,
  navItems,
  notificationLink,
}) => {
  const { currentUser, db, logout } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const unreadCount = currentUser
    ? db.notifications.filter((n) => n.userId === currentUser.id && !n.read)
        .length
    : 0;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#102A43] text-white">
      <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
        <div>
          <BrandLogo to="/" darkText={false} size="sm" />
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-blue-300">
            {portalTitle}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:bg-white/10"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#3478F6] text-white shadow-sm'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <span className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </span>
              {typeof item.badgeCount === 'number' && item.badgeCount > 0 && (
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-[#FF9F1C] text-[#102A43]">
                  {item.badgeCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-3">
        <div className="rounded-xl bg-white/5 border border-white/10 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-white truncate">
              {currentUser?.name}
            </p>
            <StatusBadge status={currentUser?.role || 'client'} />
          </div>
          <p className="text-[11px] text-slate-300 truncate mt-0.5">
            {currentUser?.businessName || currentUser?.teamTitle || currentUser?.email}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-medium text-slate-200 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-xs font-semibold text-rose-200 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] h-full z-10 shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#102A43] truncate">
                  {portalTitle}
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  Demo Prototype (LocalStorage)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {notificationLink ? (
              <Link
                to={notificationLink}
                className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#FF9F1C] text-[#102A43] text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            ) : (
              <div className="relative p-2 rounded-xl text-slate-500">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#FF9F1C] text-[#102A43] text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
            )}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-[#102A43] text-white flex items-center justify-center text-xs font-bold">
                {currentUser?.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="leading-tight">
                <p className="text-xs font-semibold text-[#102A43]">
                  {currentUser?.name}
                </p>
                <p className="text-[11px] text-slate-500 capitalize">
                  {currentUser?.role}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
