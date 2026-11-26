import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Bell,
  CheckCircle2,
  ClipboardList,
  Clock,
  FolderKanban,
  PlusCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateProjectProgress } from '../../services/storageService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';

export const ClientDashboardPage: React.FC = () => {
  const { db, currentUser } = useApp();

  const myProjects = useMemo(
    () => db.projects.filter((p) => p.clientId === currentUser?.id),
    [db.projects, currentUser]
  );

  const myEnquiries = useMemo(
    () =>
      db.enquiries.filter(
        (e) =>
          e.clientId === currentUser?.id ||
          (currentUser?.email &&
            e.email.toLowerCase() === currentUser.email.toLowerCase())
      ),
    [db.enquiries, currentUser]
  );

  const myProjectIds = useMemo(
    () => new Set(myProjects.map((p) => p.id)),
    [myProjects]
  );

  const myUpdates = useMemo(
    () =>
      db.projectUpdates.filter(
        (u) => myProjectIds.has(u.projectId) && u.visibility === 'client'
      ),
    [db.projectUpdates, myProjectIds]
  );

  const myNotifications = useMemo(
    () => db.notifications.filter((n) => n.userId === currentUser?.id),
    [db.notifications, currentUser]
  );

  const activeProjects = myProjects.filter((p) => p.status !== 'Completed');
  const completedProjects = myProjects.filter((p) => p.status === 'Completed');
  const pendingRequirementsCount = myProjects.reduce(
    (sum, p) => sum + p.pendingRequirements.length,
    0
  );

  return (
    <div className="space-y-6 page-enter">
      {/* Welcome Header */}
      <div className="rounded-2xl bg-[#102A43] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#FF9F1C]">
            Client Workspace
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold">
            Welcome, {currentUser?.name}
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            {currentUser?.businessName || 'Your Business'} • Track live project milestones, pending requirements, and agency updates.
          </p>
        </div>
        <Link
          to="/services"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3478F6] hover:bg-blue-600 text-white text-xs font-semibold transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Request New Services</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Active Projects
            </span>
            <FolderKanban className="w-4 h-4 text-[#3478F6]" />
          </div>
          <p className="mt-2 text-2xl font-bold text-[#102A43]">
            {activeProjects.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">In progress or pending</p>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Completed Projects
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-[#102A43]">
            {completedProjects.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">Delivered to date</p>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Pending Requirements
            </span>
            <AlertCircle className="w-4 h-4 text-[#FF9F1C]" />
          </div>
          <p className="mt-2 text-2xl font-bold text-[#102A43]">
            {pendingRequirementsCount}
          </p>
          <p className="mt-1 text-xs text-slate-500">Action items requested</p>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Submitted Enquiries
            </span>
            <ClipboardList className="w-4 h-4 text-[#3478F6]" />
          </div>
          <p className="mt-2 text-2xl font-bold text-[#102A43]">
            {myEnquiries.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">Linked to your account</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active & Recent Projects */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#102A43]">My Projects</h2>
            <Link
              to="/client/projects"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#3478F6] hover:underline"
            >
              <span>Open detailed milestones</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {myProjects.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              title="No active projects yet"
              description="Once an enquiry you submit is accepted and converted by the LocalLift team, your project milestones will appear here."
              action={
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3478F6] text-white text-xs font-semibold"
                >
                  Explore Services
                </Link>
              }
            />
          ) : (
            <div className="space-y-4">
              {myProjects.map((project) => {
                const progress = calculateProjectProgress(project);
                return (
                  <div
                    key={project.id}
                    className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-400">
                            {project.id}
                          </span>
                          <StatusBadge status={project.status} />
                        </div>
                        <h3 className="mt-1 text-base font-bold text-[#102A43]">
                          {project.title}
                        </h3>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        Due {project.deadline}
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-600">
                          Overall Progress ({progress.completedCount}/
                          {progress.totalCount} milestones completed)
                        </span>
                        <span className="font-bold text-[#3478F6]">
                          {progress.percentage}%
                        </span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#3478F6] transition-all duration-300"
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.selectedServiceNames.map((srv) => (
                        <span
                          key={srv}
                          className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700"
                        >
                          {srv}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Recent Enquiries */}
          {myEnquiries.length > 0 && (
            <div className="rounded-2xl bg-white border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-[#102A43] mb-3">
                Recent Service Enquiries
              </h3>
              <div className="space-y-2.5">
                {myEnquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 border border-slate-100 px-3.5 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#102A43] truncate">
                        {enq.id} • {enq.selectedServiceNames.length} Service(s)
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {enq.selectedServiceNames.join(', ')}
                      </p>
                    </div>
                    <StatusBadge status={enq.status} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Latest Updates & Notifications */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-white border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[#102A43]">
                Latest Project Updates
              </h2>
              <Link
                to="/client/updates"
                className="text-xs font-semibold text-[#3478F6] hover:underline"
              >
                View all
              </Link>
            </div>
            {myUpdates.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                No updates published yet.
              </p>
            ) : (
              <div className="space-y-3">
                {myUpdates.slice(0, 4).map((upd) => (
                  <div
                    key={upd.id}
                    className="rounded-xl bg-slate-50 border border-slate-100 p-3.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-[#102A43]">
                        {upd.title}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {upd.createdAt.slice(0, 10)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      {upd.message}
                    </p>
                    <p className="mt-1.5 text-[10px] font-medium text-slate-400">
                      By {upd.authorName}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#FF9F1C]" />
                <h2 className="text-base font-bold text-[#102A43]">
                  Notifications
                </h2>
              </div>
              <Link
                to="/client/updates"
                className="text-xs font-semibold text-[#3478F6] hover:underline"
              >
                Manage
              </Link>
            </div>
            {myNotifications.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">
                All caught up!
              </p>
            ) : (
              <div className="space-y-2">
                {myNotifications.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    className={`rounded-xl border p-3 ${
                      n.read
                        ? 'bg-white border-slate-100'
                        : 'bg-blue-50/50 border-blue-200'
                    }`}
                  >
                    <p className="text-xs font-semibold text-[#102A43]">
                      {n.title}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {n.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
