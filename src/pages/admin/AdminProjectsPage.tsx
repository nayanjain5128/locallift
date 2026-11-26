import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  FolderKanban,
  MessageSquarePlus,
  Plus,
  Search,
  Settings2,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  addProjectMilestone,
  calculateProjectProgress,
  createProject,
  publishProjectUpdate,
  updateMilestoneStatus,
  updateProject,
} from '../../services/storageService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import type { MilestoneStatus, Project, ProjectStatus } from '../../types';

const MILESTONE_STATUSES: MilestoneStatus[] = [
  'Not Started',
  'In Progress',
  'Under Review',
  'Completed',
];

export const AdminProjectsPage: React.FC = () => {
  const { db, currentUser, refreshData, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ProjectStatus>('All');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Create Project form state
  const clients = useMemo(
    () => db.users.filter((u) => u.role === 'client'),
    [db.users]
  );
  const teamMembers = useMemo(
    () => db.users.filter((u) => u.role === 'team'),
    [db.users]
  );

  const [newTitle, setNewTitle] = useState('');
  const [newClientId, setNewClientId] = useState(clients[0]?.id || '');
  const [newDeadline, setNewDeadline] = useState(
    new Date(Date.now() + 21 * 86400000).toISOString().slice(0, 10)
  );
  const [newServiceIds, setNewServiceIds] = useState<string[]>([
    'srv-business-website',
  ]);
  const [newTeamIds, setNewTeamIds] = useState<string[]>(
    teamMembers[0] ? [teamMembers[0].id] : []
  );
  const [newSummary, setNewSummary] = useState('');
  const [newInternalNotes, setNewInternalNotes] = useState('');

  // Manage Project inline states
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [updateVisibility, setUpdateVisibility] = useState<
    'client' | 'internal'
  >('client');
  const [newMilestoneName, setNewMilestoneName] = useState('');
  const [newMilestoneDesc, setNewMilestoneDesc] = useState('');
  const [newPendingReq, setNewPendingReq] = useState('');

  const filteredProjects = useMemo(() => {
    const q = search.trim().toLowerCase();
    return db.projects.filter((p) => {
      const matchesStatus =
        statusFilter === 'All' || p.status === statusFilter;
      const matchesQuery =
        !q ||
        p.id.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.businessName.toLowerCase().includes(q) ||
        p.clientName.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [db.projects, search, statusFilter]);

  const activeProject: Project | undefined = useMemo(
    () => db.projects.find((p) => p.id === activeProjectId),
    [db.projects, activeProjectId]
  );

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newClientId || newServiceIds.length === 0) {
      showToast(
        'Please complete project title, client, and at least one service',
        'error'
      );
      return;
    }
    const created = createProject({
      title: newTitle,
      clientId: newClientId,
      selectedServiceIds: newServiceIds,
      assignedTeamIds: newTeamIds,
      deadline: newDeadline,
      requirementsSummary:
        newSummary.trim() || 'Initial project scope created by Admin.',
      internalNotes: newInternalNotes,
    });
    if (created) {
      refreshData();
      setShowCreateModal(false);
      setNewTitle('');
      setNewSummary('');
      setNewInternalNotes('');
      setActiveProjectId(created.id);
      showToast('Project Created', 'success', `${created.id} is now active.`);
    }
  };

  const handleMilestoneChange = (
    projectId: string,
    milestoneId: string,
    status: MilestoneStatus
  ) => {
    if (!currentUser) return;
    updateMilestoneStatus(projectId, milestoneId, status, {
      id: currentUser.id,
      name: currentUser.name,
      role: currentUser.role,
    });
    refreshData();
    showToast(
      'Milestone Updated',
      'success',
      'Progress recalculated and synced to Client Dashboard.'
    );
  };

  const handlePublishUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !currentUser || !updateTitle.trim() || !updateMessage.trim()) {
      return;
    }
    publishProjectUpdate({
      projectId: activeProject.id,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      title: updateTitle,
      message: updateMessage,
      visibility: updateVisibility,
    });
    refreshData();
    setUpdateTitle('');
    setUpdateMessage('');
    showToast(
      updateVisibility === 'client'
        ? 'Client Update Published'
        : 'Internal Note Added',
      'success'
    );
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !newMilestoneName.trim()) return;
    addProjectMilestone(activeProject.id, {
      name: newMilestoneName,
      description: newMilestoneDesc || 'Custom project deliverable milestone.',
      assignedTeamId: activeProject.assignedTeamIds[0],
    });
    refreshData();
    setNewMilestoneName('');
    setNewMilestoneDesc('');
    showToast('Milestone Added', 'success');
  };

  const handleAddPendingReq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !newPendingReq.trim()) return;
    updateProject(activeProject.id, {
      pendingRequirements: [
        ...activeProject.pendingRequirements,
        newPendingReq.trim(),
      ],
    });
    refreshData();
    setNewPendingReq('');
    showToast('Pending requirement added for client', 'info');
  };

  const handleToggleTeamAssignment = (project: Project, teamId: string) => {
    const next = project.assignedTeamIds.includes(teamId)
      ? project.assignedTeamIds.filter((id) => id !== teamId)
      : [...project.assignedTeamIds, teamId];
    updateProject(project.id, { assignedTeamIds: next });
    refreshData();
    showToast('Team assignment updated', 'info');
  };

  const handleMarkProjectCompleted = (project: Project) => {
    updateProject(project.id, { status: 'Completed' });
    if (currentUser) {
      publishProjectUpdate({
        projectId: project.id,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorRole: 'admin',
        title: 'Project Marked Completed',
        message: `${project.title} has been marked Completed by the LocalLift Admin.`,
        visibility: 'client',
      });
    }
    refreshData();
    showToast('Project Marked Completed', 'success');
  };

  return (
    <div className="space-y-6 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#102A43]">
            Project Management
          </h1>
          <p className="text-sm text-slate-600">
            Create projects, assign team members, update milestones, and publish live updates to clients.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3478F6] hover:bg-blue-700 text-white text-xs font-semibold transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Project</span>
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {(['All', 'Active', 'Pending', 'Completed'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === st
                  ? 'bg-[#102A43] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects or clients..."
            className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No matching projects"
          description="Create a new project or convert an accepted enquiry."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProjects.map((prj) => {
            const prog = calculateProjectProgress(prj);
            const assignedNames = teamMembers
              .filter((t) => prj.assignedTeamIds.includes(t.id))
              .map((t) => t.name);
            return (
              <div
                key={prj.id}
                className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
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
                        Client: <strong>{prj.businessName}</strong> ({prj.clientName})
                      </p>
                    </div>
                    <span className="text-xs font-medium text-slate-500 shrink-0">
                      Due {prj.deadline}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600 font-medium">
                        {prog.completedCount}/{prog.totalCount} milestones completed
                      </span>
                      <span className="font-bold text-[#3478F6]">
                        {prog.percentage}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#3478F6] transition-all"
                        style={{ width: `${prog.percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-slate-500">
                    Assigned Team:{' '}
                    <span className="font-semibold text-[#102A43]">
                      {assignedNames.length > 0
                        ? assignedNames.join(', ')
                        : 'Unassigned'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveProjectId(prj.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#102A43] hover:bg-[#1E3A5F] text-white text-xs font-semibold"
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    <span>Manage Milestones & Updates</span>
                  </button>

                  {prj.status !== 'Completed' && (
                    <button
                      type="button"
                      onClick={() => handleMarkProjectCompleted(prj)}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Complete</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 page-enter max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-lg font-bold text-[#102A43]">
                Create New Project
              </h2>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., Website & Local SEO Launch"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Assign Client *
                  </label>
                  <select
                    value={newClientId}
                    onChange={(e) => setNewClientId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.businessName || c.name} ({c.name})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Target Deadline *
                  </label>
                  <input
                    type="date"
                    required
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Assign Team Members
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {teamMembers.map((t) => {
                      const active = newTeamIds.includes(t.id);
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() =>
                            setNewTeamIds((prev) =>
                              prev.includes(t.id)
                                ? prev.filter((x) => x !== t.id)
                                : [...prev, t.id]
                            )
                          }
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                            active
                              ? 'bg-[#102A43] text-white border-[#102A43]'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {t.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1.5">
                  Included Services *
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 rounded-xl border border-slate-200 bg-slate-50">
                  {db.services.map((s) => {
                    const selected = newServiceIds.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() =>
                          setNewServiceIds((prev) =>
                            prev.includes(s.id)
                              ? prev.filter((x) => x !== s.id)
                              : [...prev, s.id]
                          )
                        }
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          selected
                            ? 'bg-[#3478F6] text-white border-[#3478F6]'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Requirements Summary
                </label>
                <textarea
                  rows={2}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Internal Notes (Team & Admin Only)
                </label>
                <textarea
                  rows={2}
                  value={newInternalNotes}
                  onChange={(e) => setNewInternalNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#3478F6] text-white text-xs font-semibold"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Active Project Drawer/Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full p-6 space-y-6 page-enter max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
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
                <p className="text-xs text-slate-500">
                  Client: {activeProject.businessName} ({activeProject.clientName})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveProjectId(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Project Info Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Project Status
                </label>
                <select
                  value={activeProject.status}
                  onChange={(e) => {
                    updateProject(activeProject.id, {
                      status: e.target.value as ProjectStatus,
                    });
                    refreshData();
                    showToast('Project status updated', 'info');
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold"
                >
                  <option value="Pending">Pending</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Target Deadline
                </label>
                <input
                  type="date"
                  value={activeProject.deadline}
                  onChange={(e) => {
                    updateProject(activeProject.id, {
                      deadline: e.target.value,
                    });
                    refreshData();
                    showToast('Deadline updated', 'info');
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Assigned Team Members
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {teamMembers.map((tm) => {
                    const assigned = activeProject.assignedTeamIds.includes(
                      tm.id
                    );
                    return (
                      <button
                        key={tm.id}
                        type="button"
                        onClick={() =>
                          handleToggleTeamAssignment(activeProject, tm.id)
                        }
                        className={`px-2 py-1 rounded-lg text-[11px] font-semibold border ${
                          assigned
                            ? 'bg-[#102A43] text-white border-[#102A43]'
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        {tm.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Milestones Management */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[#102A43]">
                  Milestones (Updates Reflect Immediately on Client Dashboard)
                </h3>
                <span className="text-xs font-bold text-[#3478F6]">
                  {calculateProjectProgress(activeProject).percentage}% Complete
                </span>
              </div>

              <div className="space-y-2.5">
                {activeProject.milestones.map((ms, idx) => (
                  <div
                    key={ms.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 p-3.5"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#102A43]">
                        {idx + 1}. {ms.name}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {ms.description}
                      </p>
                    </div>
                    <select
                      value={ms.status}
                      onChange={(e) =>
                        handleMilestoneChange(
                          activeProject.id,
                          ms.id,
                          e.target.value as MilestoneStatus
                        )
                      }
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-[#102A43] shrink-0"
                    >
                      {MILESTONE_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Add Extra Milestone */}
              <form
                onSubmit={handleAddMilestone}
                className="mt-3 flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="text"
                  value={newMilestoneName}
                  onChange={(e) => setNewMilestoneName(e.target.value)}
                  placeholder="New milestone title..."
                  className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  value={newMilestoneDesc}
                  onChange={(e) => setNewMilestoneDesc(e.target.value)}
                  placeholder="Milestone description (optional)..."
                  className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-[#102A43]"
                >
                  + Add Milestone
                </button>
              </form>
            </div>

            {/* Publish Client Update & Internal Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-200">
              <form onSubmit={handlePublishUpdate} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#102A43] flex items-center gap-1.5">
                    <MessageSquarePlus className="w-4 h-4 text-[#3478F6]" />
                    <span>Publish Update / Note</span>
                  </h3>
                  <select
                    value={updateVisibility}
                    onChange={(e) =>
                      setUpdateVisibility(
                        e.target.value as 'client' | 'internal'
                      )
                    }
                    className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-semibold"
                  >
                    <option value="client">Client-Visible Update</option>
                    <option value="internal">Internal Team Note</option>
                  </select>
                </div>
                <input
                  type="text"
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  placeholder="Update title..."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
                <textarea
                  rows={2}
                  value={updateMessage}
                  onChange={(e) => setUpdateMessage(e.target.value)}
                  placeholder="Write update details..."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#3478F6] hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  Publish{' '}
                  {updateVisibility === 'client' ? 'to Client' : 'Internal Note'}
                </button>
              </form>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#102A43]">
                  Pending Client Requirements & Internal Notes
                </h3>
                <form onSubmit={handleAddPendingReq} className="flex gap-2">
                  <input
                    type="text"
                    value={newPendingReq}
                    onChange={(e) => setNewPendingReq(e.target.value)}
                    placeholder="Request asset/input from client..."
                    className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-xl bg-[#102A43] text-white text-xs font-semibold"
                  >
                    Request
                  </button>
                </form>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Internal Project Notes
                  </label>
                  <textarea
                    rows={3}
                    value={activeProject.internalNotes}
                    onChange={(e) => {
                      updateProject(activeProject.id, {
                        internalNotes: e.target.value,
                      });
                      refreshData();
                    }}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
