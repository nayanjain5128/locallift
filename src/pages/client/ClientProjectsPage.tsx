import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  FolderKanban,
  Layers,
  ListChecks,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  calculateProjectProgress,
  resolvePendingRequirement,
} from '../../services/storageService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';

export const ClientProjectsPage: React.FC = () => {
  const { db, currentUser, refreshData, showToast } = useApp();

  const myProjects = useMemo(
    () => db.projects.filter((p) => p.clientId === currentUser?.id),
    [db.projects, currentUser]
  );

  const [selectedId, setSelectedId] = useState<string>(
    myProjects[0]?.id || ''
  );

  const activeProject =
    myProjects.find((p) => p.id === selectedId) || myProjects[0];

  const handleMarkRequirementReady = (req: string) => {
    if (!activeProject || !currentUser) return;
    resolvePendingRequirement(activeProject.id, req, currentUser);
    refreshData();
    showToast(
      'Requirement marked ready',
      'success',
      'LocalLift team has been notified.'
    );
  };

  if (myProjects.length === 0) {
    return (
      <div className="page-enter">
        <h1 className="text-2xl font-bold text-[#102A43] mb-6">My Projects</h1>
        <EmptyState
          icon={FolderKanban}
          title="No projects assigned to your account yet"
          description="Submit a customized service enquiry from our Services page. Once accepted and converted by our team, full milestone tracking appears here."
          action={
            <Link
              to="/services"
              className="inline-flex items-center px-4 py-2.5 rounded-xl bg-[#3478F6] text-white text-xs font-semibold"
            >
              Build Service Enquiry
            </Link>
          }
        />
      </div>
    );
  }

  const progress = calculateProjectProgress(activeProject);
  const projectUpdates = db.projectUpdates.filter(
    (u) => u.projectId === activeProject.id && u.visibility === 'client'
  );
  const assignedTeamNames = db.users
    .filter((u) => activeProject.assignedTeamIds.includes(u.id))
    .map((u) => `${u.name}${u.teamTitle ? ` (${u.teamTitle})` : ''}`);

  return (
    <div className="space-y-6 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#102A43]">My Projects</h1>
          <p className="text-sm text-slate-600">
            Track real-time milestones, selected services, and pending requirements.
          </p>
        </div>

        {myProjects.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {myProjects.map((p) => (
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
                {p.id} • {p.title.slice(0, 26)}
                {p.title.length > 26 ? '…' : ''}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Project Summary Card */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-slate-400">
                {activeProject.id}
              </span>
              <StatusBadge status={activeProject.status} size="md" />
              {activeProject.isDemo && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Demo Project
                </span>
              )}
            </div>
            <h2 className="mt-1.5 text-xl font-bold text-[#102A43]">
              {activeProject.title}
            </h2>
            <p className="mt-1 text-sm text-slate-600 max-w-3xl">
              {activeProject.requirementsSummary}
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-1 shrink-0 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#102A43]">
              <Calendar className="w-4 h-4 text-[#3478F6]" />
              Target Deadline: {activeProject.deadline}
            </span>
            {assignedTeamNames.length > 0 && (
              <span className="text-[11px] text-slate-500">
                Team: {assignedTeamNames.join(', ')}
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar calculated from milestones */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-semibold text-[#102A43]">
              Milestone Completion Progress ({progress.completedCount} of{' '}
              {progress.totalCount} Completed)
            </span>
            <span className="font-bold text-[#3478F6]">
              {progress.percentage}%
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#3478F6] transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>

        {/* Selected Services */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#3478F6]" />
            Selected Services
          </p>
          <div className="flex flex-wrap gap-2">
            {activeProject.selectedServiceNames.map((srv) => (
              <span
                key={srv}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#102A43] border border-blue-100"
              >
                {srv}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Milestones & Right Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 7 Milestones Timeline */}
        <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <ListChecks className="w-5 h-5 text-[#3478F6]" />
            <h3 className="text-lg font-bold text-[#102A43]">
              Project Milestones & Timeline
            </h3>
          </div>

          <div className="space-y-4">
            {activeProject.milestones.map((ms, idx) => {
              const isCompleted = ms.status === 'Completed';
              const isActive =
                ms.status === 'In Progress' || ms.status === 'Under Review';

              return (
                <div
                  key={ms.id}
                  className={`rounded-xl border p-4 transition-colors ${
                    isCompleted
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : isActive
                      ? 'bg-blue-50/40 border-blue-200'
                      : 'bg-slate-50/50 border-slate-200'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5">
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : isActive ? (
                          <Clock className="w-5 h-5 text-[#3478F6]" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300" />
                        )}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-[#102A43]">
                          {idx + 1}. {ms.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                          {ms.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <StatusBadge status={ms.status} />
                      {ms.completionDate && (
                        <span className="text-[11px] text-emerald-700 font-medium">
                          Completed {ms.completionDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending Requirements & Updates */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl bg-white border border-slate-200 p-6">
            <h3 className="text-base font-bold text-[#102A43] mb-3">
              Pending Client Requirements
            </h3>
            {activeProject.pendingRequirements.length === 0 ? (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-medium text-emerald-800">
                All requested requirements have been submitted. Thank you!
              </div>
            ) : (
              <div className="space-y-2.5">
                {activeProject.pendingRequirements.map((req) => (
                  <div
                    key={req}
                    className="rounded-xl bg-amber-50/70 border border-amber-200 p-3.5 flex items-start justify-between gap-3"
                  >
                    <p className="text-xs font-medium text-amber-950 leading-relaxed">
                      {req}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleMarkRequirementReady(req)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#102A43] hover:bg-[#1E3A5F] text-white text-[11px] font-semibold shrink-0"
                    >
                      Mark Ready
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-[#3478F6]" />
              <h3 className="text-base font-bold text-[#102A43]">
                Project Updates
              </h3>
            </div>
            {projectUpdates.length === 0 ? (
              <p className="text-xs text-slate-500 py-3">
                No updates published for this project yet.
              </p>
            ) : (
              <div className="space-y-3">
                {projectUpdates.map((u) => (
                  <div
                    key={u.id}
                    className="rounded-xl bg-slate-50 border border-slate-100 p-3.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-[#102A43]">
                        {u.title}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {u.createdAt.slice(0, 10)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      {u.message}
                    </p>
                    <p className="mt-1.5 text-[10px] font-medium text-slate-400">
                      Posted by {u.authorName}
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
