import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  FolderKanban,
  Send,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  calculateProjectProgress,
  markAllNotificationsRead,
} from '../../services/storageService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';

export const TeamDashboardPage: React.FC = () => {
  const { db, currentUser, refreshData, showToast } = useApp();

  const assignedProjects = useMemo(
    () =>
      db.projects.filter(
        (p) => currentUser && p.assignedTeamIds.includes(currentUser.id)
      ),
    [db.projects, currentUser]
  );

  const activeAssigned = assignedProjects.filter(
    (p) => p.status !== 'Completed'
  );
  const completedAssigned = assignedProjects.filter(
    (p) => p.status === 'Completed'
  );
  const pendingMilestonesCount = assignedProjects.reduce(
    (sum, p) =>
      sum + p.milestones.filter((m) => m.status !== 'Completed').length,
    0
  );

  const myNotifications = useMemo(
    () => db.notifications.filter((n) => n.userId === currentUser?.id),
    [db.notifications, currentUser]
  );

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="rounded-2xl bg-[#102A43] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#FF9F1C]">
            Team Workspace
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold">
            Hello, {currentUser?.name}
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            {currentUser?.teamTitle || 'Agency Specialist'} • Manage assigned milestones, post progress updates, and submit work for admin review.
          </p>
        </div>

        <Link
          to="/team/projects"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3478F6] hover:bg-blue-600 text-white text-xs font-semibold shrink-0"
        >
          <span>Open Assigned Projects</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Assigned Active Projects
            </span>
            <FolderKanban className="w-4 h-4 text-[#3478F6]" />
          </div>
          <p className="mt-2 text-2xl font-bold text-[#102A43]">
            {activeAssigned.length}
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Open Milestones
            </span>
            <Clock className="w-4 h-4 text-[#FF9F1C]" />
          </div>
          <p className="mt-2 text-2xl font-bold text-[#102A43]">
            {pendingMilestonesCount}
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Completed Assignments
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-[#102A43]">
            {completedAssigned.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Assigned Projects List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#102A43]">
              Your Assigned Projects
            </h2>
            <Link
              to="/team/projects"
              className="text-xs font-semibold text-[#3478F6] hover:underline"
            >
              Update milestones →
            </Link>
          </div>

          {assignedProjects.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              title="No assigned projects yet"
              description="Projects assigned to you by the LocalLift Admin will appear here."
            />
          ) : (
            <div className="space-y-3.5">
              {assignedProjects.map((prj) => {
                const prog = calculateProjectProgress(prj);
                return (
                  <div
                    key={prj.id}
                    className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-400">
                            {prj.id}
                          </span>
                          <StatusBadge status={prj.status} />
                        </div>
                        <h3 className="mt-1 text-base font-bold text-[#102A43]">
                          {prj.title}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Client: {prj.businessName}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-[#3478F6]" />
                        Due {prj.deadline}
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-600">
                          {prog.completedCount}/{prog.totalCount} milestones completed
                        </span>
                        <span className="font-bold text-[#3478F6]">
                          {prog.percentage}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#3478F6]"
                          style={{ width: `${prog.percentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Link
                        to="/team/projects"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3478F6] hover:underline"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Manage Tasks & Submit for Review</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Team Notifications */}
        <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200 p-6 h-fit">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#FF9F1C]" />
              <h2 className="text-base font-bold text-[#102A43]">
                Team Notifications
              </h2>
            </div>
            {myNotifications.some((n) => !n.read) && currentUser && (
              <button
                type="button"
                onClick={() => {
                  markAllNotificationsRead(currentUser.id);
                  refreshData();
                  showToast('Notifications marked read', 'info');
                }}
                className="text-xs font-semibold text-[#3478F6] hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {myNotifications.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">
              No recent notifications.
            </p>
          ) : (
            <div className="space-y-2.5">
              {myNotifications.slice(0, 6).map((n) => (
                <div
                  key={n.id}
                  className={`rounded-xl border p-3 ${
                    n.read
                      ? 'bg-white border-slate-100'
                      : 'bg-blue-50/50 border-blue-200'
                  }`}
                >
                  <p className="text-xs font-bold text-[#102A43]">{n.title}</p>
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
  );
};
