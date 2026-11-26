import React from 'react';
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import {
  BarChart3,
  Bell,
  Briefcase,
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  Layers,
  Settings,
  Users,
} from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastContainer } from './components/common/ToastContainer';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { PublicLayout } from './components/layout/PublicLayout';
import {
  DashboardLayout,
  type SidebarNavItem,
} from './components/layout/DashboardLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { OurWorkPage } from './pages/public/OurWorkPage';
import { ContactPage } from './pages/public/ContactPage';
import { LoginPage } from './pages/public/LoginPage';
import { SignupPage } from './pages/public/SignupPage';

// Client Pages
import { ClientDashboardPage } from './pages/client/ClientDashboardPage';
import { ClientProjectsPage } from './pages/client/ClientProjectsPage';
import { ClientUpdatesPage } from './pages/client/ClientUpdatesPage';
import { ClientSettingsPage } from './pages/client/ClientSettingsPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminEnquiriesPage } from './pages/admin/AdminEnquiriesPage';
import { AdminClientsPage } from './pages/admin/AdminClientsPage';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { AdminTeamPage } from './pages/admin/AdminTeamPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Team Pages
import { TeamDashboardPage } from './pages/team/TeamDashboardPage';
import { TeamProjectsPage } from './pages/team/TeamProjectsPage';

const ClientPortalShell: React.FC = () => {
  const { db, currentUser } = useApp();
  const unreadNotifs = db.notifications.filter(
    (n) => n.userId === currentUser?.id && !n.read
  ).length;

  const navItems: SidebarNavItem[] = [
    { to: '/client/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/client/projects', label: 'My Projects', icon: FolderKanban },
    {
      to: '/client/updates',
      label: 'Updates & Alerts',
      icon: Bell,
      badgeCount: unreadNotifs,
    },
    { to: '/client/settings', label: 'Profile Settings', icon: Settings },
  ];

  return (
    <DashboardLayout
      portalTitle="Client Portal"
      navItems={navItems}
      notificationLink="/client/updates"
    />
  );
};

const AdminPortalShell: React.FC = () => {
  const { db } = useApp();
  const newEnquiriesCount = db.enquiries.filter(
    (e) => e.status === 'New'
  ).length;

  const navItems: SidebarNavItem[] = [
    { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    {
      to: '/admin/enquiries',
      label: 'Enquiries',
      icon: ClipboardList,
      badgeCount: newEnquiriesCount,
    },
    { to: '/admin/clients', label: 'Clients', icon: Users },
    { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
    { to: '/admin/team', label: 'Team Members', icon: Briefcase },
    { to: '/admin/services', label: 'Services', icon: Layers },
    { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return <DashboardLayout portalTitle="Admin Portal" navItems={navItems} />;
};

const TeamPortalShell: React.FC = () => {
  const { db, currentUser } = useApp();
  const assignedCount = db.projects.filter(
    (p) =>
      currentUser &&
      p.assignedTeamIds.includes(currentUser.id) &&
      p.status !== 'Completed'
  ).length;

  const navItems: SidebarNavItem[] = [
    { to: '/team/dashboard', label: 'Overview', icon: LayoutDashboard },
    {
      to: '/team/projects',
      label: 'Assigned Projects',
      icon: FolderKanban,
      badgeCount: assignedCount,
    },
  ];

  return (
    <DashboardLayout
      portalTitle="Team Workspace"
      navItems={navItems}
      notificationLink="/team/dashboard"
    />
  );
};

const NotFoundPage: React.FC = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
    <span className="text-xs font-bold uppercase tracking-wider text-[#3478F6]">
      404
    </span>
    <h1 className="mt-2 text-3xl font-bold text-[#102A43]">Page Not Found</h1>
    <p className="mt-2 text-sm text-slate-600 max-w-md">
      The page you are looking for does not exist or has been moved.
    </p>
    <Link
      to="/"
      className="mt-6 px-5 py-2.5 rounded-xl bg-[#102A43] text-white text-sm font-semibold hover:bg-[#1E3A5F]"
    >
      Return Home
    </Link>
  </div>
);

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/our-work" element={<OurWorkPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Protected Client Portal Routes */}
          <Route
            path="/client"
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <ClientPortalShell />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={<Navigate to="/client/dashboard" replace />}
            />
            <Route path="dashboard" element={<ClientDashboardPage />} />
            <Route path="projects" element={<ClientProjectsPage />} />
            <Route path="updates" element={<ClientUpdatesPage />} />
            <Route path="settings" element={<ClientSettingsPage />} />
          </Route>

          {/* Protected Private Admin Dashboard Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPortalShell />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={<Navigate to="/admin/dashboard" replace />}
            />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="enquiries" element={<AdminEnquiriesPage />} />
            <Route path="clients" element={<AdminClientsPage />} />
            <Route path="projects" element={<AdminProjectsPage />} />
            <Route path="team" element={<AdminTeamPage />} />
            <Route path="services" element={<AdminServicesPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Protected Team Workspace Routes */}
          <Route
            path="/team"
            element={
              <ProtectedRoute allowedRoles={['team']}>
                <TeamPortalShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/team/dashboard" replace />} />
            <Route path="dashboard" element={<TeamDashboardPage />} />
            <Route path="projects" element={<TeamProjectsPage />} />
          </Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
