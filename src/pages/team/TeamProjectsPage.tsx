import React, { useMemo, useState } from 'react';
import {
  Calendar,
  FolderKanban,
  Lock,
  MessageSquarePlus,
  Send,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  calculateProjectProgress,
  publishProjectUpdate,
  updateMilestoneStatus,
} from '../../services/storageService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import type { MilestoneStatus } from '../../types';

const TEAM_ALLOWED_STATUSES: MilestoneStatus[] = [
  'Not Started',
  'In Progress',
  'Under Review',
];

export const TeamProjectsPage: React.FC = () => {
  const { db, currentUser, refreshData, showToast } = useApp();

  const assignedProjects = useMemo(
    () =>
      db.projects.filter(
        (p) => currentUser && p.assignedTeamIds.includes(currentUser.id)
      ),
    [db.projects, currentUser]
  );

  const [selectedId, setSelectedId] = useState<string>(
    assignedProjects[0]?.id || ''
  );
  const activeProject =
    assignedProjects.find((p) => p.id === selectedId) || assignedProjects[0];

  const [updateTitle, setUpdateTitle] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [visibility, setVisibility] = useState<'client' | 'internal'>('internal');

  if (assignedProjects.length === 0) {
    return (
      <div className="page-enter">
        <h1 className="text-2xl font-bold text-[#102A43] mb-6">
          Assigned Projects
        </h1>
        <EmptyState
          icon={FolderKanban}
          title="No projects assigned to you"
          description="Once an Admin assigns you to a client project, requirements, deadlines, and milestones appear here."
        />
      </div>
    );
  }

  const progress = calculateProjectProgress(activeProject);
  const projectUpdates = db.projectUpdates.filter(
    (u) => u.projectId === activeProject.id
  );

  const handleMilestoneChange = (
    milestoneId: string,
    status: MilestoneStatus
  ) => {
    if (!currentUser) return;
    updateMilestoneStatus(activeProject.id, milestoneId, status, {
      id: currentUser.id,
      name: currentUser.name,
      role: 'team',
    });
    refreshData();
    showToast(
      status === 'Under Review'
        ? 'Submitted for Admin Review'
        : `Milestone marked "${status}"`,
      status === 'Under Review' ? 'info' : 'success',
      status === 'Under Review'
        ? 'Admin has been notified to review and approve completion.'
        : undefined
    );
  };

  const handlePostUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !updateTitle.trim() || !updateMessage.trim()) return;
    publishProjectUpdate({
      projectId: activeProject.id,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: 'team',
      title: updateTitle,
      message: updateMessage,
      visibility,
    });
    refreshData();
    setUpdateTitle('');
    setUpdateMessage('');
    showToast(
      visibility === 'internal'
        ? 'Internal note sent to Admin'
        : 'Progress update published',
      'success'
    );
  };

  return (
    <div className="space-y-6 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#102A43]">
            Assigned Projects & Tasks
          </h1>
          <p className="text-sm text-slate-600">
            Update task progress, post updates, and submit milestones for Admin review.
          </p>
        </div>

        {assignedProjects.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {assignedProjects.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedId(p.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                  activeProject.id === p.id
                    ? 'bg-[#102A43] text-white border-[#102A43]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {p.id} • {p.businessName}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Project Overview Card */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">
                {activeProject.id}
              </span>
              <StatusBadge status={activeProject.status} />
            </div>
            <h2 className="mt-1 text-xl font-bold text-[#102A43]">
              {activeProject.title}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Client: <strong>{activeProject.businessName}</strong> ({activeProject.clientName})
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#102A43] shrink-0">
            <Calendar className="w-4 h-4 text-[#3478F6]" />
            Deadline: {activeProject.deadline}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
            <p className="text-xs font-bold text-[#102A43] mb-1">
              Project Requirements
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {activeProject.requirementsSummary}
            </p>
          </div>

          <div className="rounded-xl bg-amber-50/60 border border-amber-200 p-4">
            <p className="text-xs font-bold text-[#102A43] flex items-center gap-1.5 mb-1">
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>Admin / Internal Notes</span>
            </p>
            <p className="text-xs text-amber-950 leading-relaxed">
              {activeProject.internalNotes || 'No internal notes recorded.'}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-600">
              Milestone Progress ({progress.completedCount}/{progress.totalCount} approved completed)
            </span>
            <span className="font-bold text-[#3478F6]">
              {progress.percentage}%
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#3478F6] transition-all"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Milestones & Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#102A43]">
              Project Milestones
            </h3>
            <span className="text-[11px] text-slate-500">
              Admin finalizes “Completed” after review
            </span>
          </div>

          <div className="space-y-3">
            {activeProject.milestones.map((ms, idx) => {
              const isApprovedCompleted = ms.status === 'Completed';
              return (
                <div
                  key={ms.id}
                  className="rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-[#102A43]">
                        {idx + 1}. {ms.name}
                      </p>
                      <StatusBadge status={ms.status} />
                    </div>
                    <p className="mt-1 text-[11px] text-slate-600">
                      {ms.description}
                    </p>
                  </div>

                  {isApprovedCompleted ? (
                    <span className="text-[11px] font-semibold text-emerald-700 shrink-0">
                      Approved {ms.completionDate}
                    </span>
                  ) : (
                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={ms.status}
                        onChange={(e) =>
                          handleMilestoneChange(
                            ms.id,
                            e.target.value as MilestoneStatus
                          )
                        }
                        className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-[#102A43]"
                      >
                        {TEAM_ALLOWED_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                      {ms.status !== 'Under Review' && (
                        <button
                          type="button"
                          onClick={() =>
                            handleMilestoneChange(ms.id, 'Under Review')
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#FF9F1C] hover:bg-[#e88b0c] text-[#102A43] text-[11px] font-bold"
                        >
                          <Send className="w-3 h-3" />
                          <span>Submit Review</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Progress Updates */}
        <div className="lg:col-span-5 space-y-5">
          <form
            onSubmit={handlePostUpdate}
            className="rounded-2xl bg-white border border-slate-200 p-6 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#102A43] flex items-center gap-1.5">
                <MessageSquarePlus className="w-4 h-4 text-[#3478F6]" />
                <span>Add Progress Update</span>
              </h3>
              <select
                value={visibility}
                onChange={(e) =>
                  setVisibility(e.target.value as 'client' | 'internal')
                }
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-semibold"
              >
                <option value="internal">Internal (Admin & Team)</option>
                <option value="client">Client-Visible Update</option>
              </select>
            </div>

            <input
              type="text"
              value={updateTitle}
              onChange={(e) => setUpdateTitle(e.target.value)}
              placeholder="Update summary..."
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
            />
            <textarea
              rows={3}
              value={updateMessage}
              onChange={(e) => setUpdateMessage(e.target.value)}
              placeholder="Describe progress, blockers, or items ready for admin review..."
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#3478F6] hover:bg-blue-700 text-white text-xs font-semibold"
            >
              Post {visibility === 'internal' ? 'to Admin / Team' : 'Update'}
            </button>
          </form>

          <div className="rounded-2xl bg-white border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-[#102A43] mb-3">
              Recent Project Activity
            </h3>
            {projectUpdates.length === 0 ? (
              <p className="text-xs text-slate-500">No updates yet.</p>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto">
                {projectUpdates.map((u) => (
                  <div
                    key={u.id}
                    className="rounded-xl bg-slate-50 border border-slate-100 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#102A43]">
                        {u.title}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          u.visibility === 'internal'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-[#3478F6]'
                        }`}
                      >
                        {u.visibility}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">{u.message}</p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      {u.authorName} • {u.createdAt.slice(0, 10)}
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
