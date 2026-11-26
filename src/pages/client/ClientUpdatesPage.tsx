import React, { useMemo } from 'react';
import { Bell, CheckCheck, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  markAllNotificationsRead,
  markNotificationRead,
} from '../../services/storageService';
import { EmptyState } from '../../components/common/EmptyState';

export const ClientUpdatesPage: React.FC = () => {
  const { db, currentUser, refreshData, showToast } = useApp();

  const myProjectIds = useMemo(
    () =>
      new Set(
        db.projects
          .filter((p) => p.clientId === currentUser?.id)
          .map((p) => p.id)
      ),
    [db.projects, currentUser]
  );

  const updates = useMemo(
    () =>
      db.projectUpdates.filter(
        (u) => myProjectIds.has(u.projectId) && u.visibility === 'client'
      ),
    [db.projectUpdates, myProjectIds]
  );

  const notifications = useMemo(
    () => db.notifications.filter((n) => n.userId === currentUser?.id),
    [db.notifications, currentUser]
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = (id: string) => {
    markNotificationRead(id);
    refreshData();
  };

  const handleMarkAll = () => {
    if (!currentUser) return;
    markAllNotificationsRead(currentUser.id);
    refreshData();
    showToast('All notifications marked read', 'info');
  };

  return (
    <div className="space-y-6 page-enter">
      <div>
        <h1 className="text-2xl font-bold text-[#102A43]">
          Updates & Notifications
        </h1>
        <p className="text-sm text-slate-600">
          Stay synced with milestone changes and messages from the LocalLift agency team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Notifications */}
        <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200 p-6">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#FF9F1C]" />
              <h2 className="text-base font-bold text-[#102A43]">
                Notifications ({unreadCount} unread)
              </h2>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAll}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#3478F6] hover:underline"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No notifications"
              description="Updates on enquiries, milestones, and project deliveries will appear here."
            />
          ) : (
            <div className="space-y-2.5">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`rounded-xl border p-3.5 transition-colors ${
                    n.read
                      ? 'bg-white border-slate-100'
                      : 'bg-blue-50/60 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-bold text-[#102A43]">
                      {n.title}
                    </p>
                    {!n.read && (
                      <button
                        type="button"
                        onClick={() => handleMarkRead(n.id)}
                        className="text-[11px] font-semibold text-[#3478F6] hover:underline shrink-0"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    {n.message}
                  </p>
                  <p className="mt-1.5 text-[10px] text-slate-400">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Project Updates Feed */}
        <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-[#3478F6]" />
            <h2 className="text-base font-bold text-[#102A43]">
              Client-Visible Project Updates
            </h2>
          </div>

          {updates.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No project updates yet"
              description="Progress updates posted by your project team or admin will show up chronologically here."
            />
          ) : (
            <div className="space-y-3.5">
              {updates.map((upd) => {
                const project = db.projects.find((p) => p.id === upd.projectId);
                return (
                  <article
                    key={upd.id}
                    className="rounded-xl bg-slate-50 border border-slate-200 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-[#102A43]">
                        {project?.title || upd.projectId}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(upd.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="mt-2 text-sm font-bold text-[#102A43]">
                      {upd.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      {upd.message}
                    </p>
                    <p className="mt-2 text-[11px] font-medium text-slate-500">
                      Posted by {upd.authorName} ({upd.authorRole})
                    </p>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
