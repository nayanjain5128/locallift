import React, { useMemo, useState } from 'react';
import { Briefcase, Plus, UserCog, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  createTeamMember,
  updateProject,
  updateUserProfile,
} from '../../services/storageService';
import { StatusBadge } from '../../components/common/StatusBadge';

export const AdminTeamPage: React.FC = () => {
  const { db, refreshData, showToast } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  // New Team Member Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Team123!');
  const [teamTitle, setTeamTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const teamMembers = useMemo(
    () => db.users.filter((u) => u.role === 'team'),
    [db.users]
  );

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !password || !teamTitle.trim()) {
      setError('Please complete all required fields.');
      return;
    }
    const res = createTeamMember({ name, email, password, teamTitle, phone });
    if (res.error) {
      setError(res.error);
      return;
    }
    refreshData();
    setShowAddModal(false);
    setName('');
    setEmail('');
    setTeamTitle('');
    setPhone('');
    showToast('Team Member Added', 'success', `${res.user?.name} can now log in.`);
  };

  const handleSaveRoleTitle = (userId: string) => {
    if (!editTitle.trim()) return;
    updateUserProfile(userId, { teamTitle: editTitle.trim() });
    refreshData();
    setEditingMemberId(null);
    showToast('Team role updated', 'info');
  };

  const handleAssignProject = (projectId: string, teamId: string) => {
    const project = db.projects.find((p) => p.id === projectId);
    if (!project) return;
    const exists = project.assignedTeamIds.includes(teamId);
    const next = exists
      ? project.assignedTeamIds.filter((id) => id !== teamId)
      : [...project.assignedTeamIds, teamId];
    updateProject(projectId, { assignedTeamIds: next });
    refreshData();
    showToast(
      exists ? 'Removed from project' : 'Assigned to project',
      'info'
    );
  };

  return (
    <div className="space-y-6 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#102A43]">Team Management</h1>
          <p className="text-sm text-slate-600">
            Create team member demo accounts, manage roles, and assign project workloads.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3478F6] hover:bg-blue-700 text-white text-xs font-semibold shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teamMembers.map((member) => {
          const assignedProjects = db.projects.filter((p) =>
            p.assignedTeamIds.includes(member.id)
          );
          const isEditing = editingMemberId === member.id;

          return (
            <div
              key={member.id}
              className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#102A43] text-white flex items-center justify-center font-bold text-sm">
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-[#102A43]">
                        {member.name}
                      </h2>
                      <StatusBadge status="team" />
                    </div>
                    <p className="text-xs text-slate-500">{member.email}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingMemberId(isEditing ? null : member.id);
                    setEditTitle(member.teamTitle || '');
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <UserCog className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Cancel' : 'Edit Role'}</span>
                </button>
              </div>

              {isEditing ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Team role / title"
                    className="flex-1 rounded-xl border border-slate-300 px-3 py-1.5 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveRoleTitle(member.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#3478F6] text-white text-xs font-semibold"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <p className="text-xs font-semibold text-[#3478F6] flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{member.teamTitle || 'Specialist'}</span>
                </p>
              )}

              {/* Assigned Projects */}
              <div className="pt-3 border-t border-slate-100">
                <p className="text-xs font-bold text-[#102A43] mb-2">
                  Assigned Work ({assignedProjects.length} project(s))
                </p>
                {assignedProjects.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    No active assignments yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {assignedProjects.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 border border-slate-100 px-3 py-2 text-xs"
                      >
                        <span className="font-semibold text-[#102A43] truncate">
                          {p.id} • {p.title}
                        </span>
                        <StatusBadge status={p.status} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Assign Toggle */}
                {db.projects.length > 0 && (
                  <div className="mt-3">
                    <p className="text-[11px] font-semibold text-slate-400 mb-1.5">
                      Toggle Project Assignments:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {db.projects.map((p) => {
                        const assigned = p.assignedTeamIds.includes(member.id);
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => handleAssignProject(p.id, member.id)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                              assigned
                                ? 'bg-[#102A43] text-white border-[#102A43]'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {assigned ? '✓ ' : '+ '}
                            {p.id}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Team Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 page-enter">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-lg font-bold text-[#102A43]">
                Create Team Member Demo Account
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <p className="mt-3 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <form onSubmit={handleCreateMember} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Kabir Sharma"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Role / Specialty *
                </label>
                <input
                  type="text"
                  required
                  value={teamTitle}
                  onChange={(e) => setTeamTitle(e.target.value)}
                  placeholder="e.g., SEO & Content Specialist"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="member@locallift.demo"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Demo Password *
                </label>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#3478F6] text-white text-xs font-semibold"
                >
                  Create Team Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
