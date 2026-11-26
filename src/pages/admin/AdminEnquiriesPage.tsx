import React, { useMemo, useState } from 'react';
import {
  CheckCircle,
  Eye,
  FolderPlus,
  Search,
  X,
  XCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  convertEnquiryToProject,
  updateEnquiryStatus,
} from '../../services/storageService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import type { Enquiry, EnquiryStatus } from '../../types';

const STATUS_FILTERS: Array<'All' | EnquiryStatus> = [
  'All',
  'New',
  'Under Review',
  'Accepted',
  'Rejected',
  'Converted',
];

export const AdminEnquiriesPage: React.FC = () => {
  const { db, refreshData, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | EnquiryStatus>('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  // Convert-to-project modal state
  const [convertTarget, setConvertTarget] = useState<Enquiry | null>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 21 * 86400000).toISOString().slice(0, 10)
  );
  const [assignedTeamIds, setAssignedTeamIds] = useState<string[]>([]);

  const teamMembers = useMemo(
    () => db.users.filter((u) => u.role === 'team'),
    [db.users]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return db.enquiries.filter((e) => {
      const matchesStatus =
        statusFilter === 'All' || e.status === statusFilter;
      const matchesQuery =
        !q ||
        e.id.toLowerCase().includes(q) ||
        e.businessName.toLowerCase().includes(q) ||
        e.ownerName.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [db.enquiries, search, statusFilter]);

  const handleStatusChange = (id: string, status: EnquiryStatus) => {
    const updated = updateEnquiryStatus(id, status);
    refreshData();
    if (selectedEnquiry?.id === id && updated) {
      setSelectedEnquiry(updated);
    }
    showToast(`Enquiry marked "${status}"`, 'info');
  };

  const openConvertModal = (enq: Enquiry) => {
    setConvertTarget(enq);
    setProjectTitle(`${enq.businessName} Digital Growth`);
    setDeadline(
      new Date(Date.now() + 21 * 86400000).toISOString().slice(0, 10)
    );
    setAssignedTeamIds(teamMembers[0] ? [teamMembers[0].id] : []);
  };

  const handleConvertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertTarget) return;
    const res = convertEnquiryToProject(convertTarget.id, {
      projectTitle,
      deadline,
      assignedTeamIds,
    });
    if (res.error) {
      showToast(res.error, 'error');
      return;
    }
    refreshData();
    setConvertTarget(null);
    setSelectedEnquiry(null);
    showToast(
      `Project Created (${res.project?.id})`,
      'success',
      `Converted enquiry ${convertTarget.id} and notified client.`
    );
  };

  const toggleTeamSelection = (id: string) => {
    setAssignedTeamIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 page-enter">
      <div>
        <h1 className="text-2xl font-bold text-[#102A43]">
          Enquiry Management
        </h1>
        <p className="text-sm text-slate-600">
          Review incoming custom service enquiries, update statuses, and convert accepted requests into tracked projects.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((st) => (
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

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search business, owner, ID..."
            className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
          />
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matching enquiries"
          description="Try clearing your search filter or submit a new enquiry from the public Services page."
        />
      ) : (
        <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Enquiry</th>
                  <th className="py-3.5 px-4">Business & Contact</th>
                  <th className="py-3.5 px-4">Selected Services</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 align-top">
                      <span className="font-mono text-xs font-bold text-[#102A43]">
                        {enq.id}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {enq.createdAt.slice(0, 10)}
                      </p>
                      {enq.isDemo && (
                        <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          Demo
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 align-top">
                      <p className="font-bold text-[#102A43]">
                        {enq.businessName}
                      </p>
                      <p className="text-xs text-slate-600">
                        {enq.ownerName} • {enq.email}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {enq.businessCategory} • {enq.location}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 align-top max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {enq.selectedServiceNames.slice(0, 3).map((srv) => (
                          <span
                            key={srv}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                          >
                            {srv}
                          </span>
                        ))}
                        {enq.selectedServiceNames.length > 3 && (
                          <span className="text-[11px] font-semibold text-[#3478F6]">
                            +{enq.selectedServiceNames.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 align-top">
                      <StatusBadge status={enq.status} />
                    </td>
                    <td className="py-3.5 px-4 align-top text-right">
                      <div className="inline-flex flex-wrap justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedEnquiry(enq)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-[#102A43] hover:bg-slate-100"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>
                        {enq.status !== 'Converted' &&
                          enq.status !== 'Rejected' && (
                            <button
                              type="button"
                              onClick={() => openConvertModal(enq)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#3478F6] hover:bg-blue-700 text-white text-xs font-semibold"
                            >
                              <FolderPlus className="w-3.5 h-3.5" />
                              <span>Convert</span>
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enquiry Details Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-5 page-enter">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">
                    {selectedEnquiry.id}
                  </span>
                  <StatusBadge status={selectedEnquiry.status} />
                </div>
                <h2 className="mt-1 text-xl font-bold text-[#102A43]">
                  {selectedEnquiry.businessName}
                </h2>
                <p className="text-xs text-slate-500">
                  {selectedEnquiry.businessCategory} • {selectedEnquiry.location}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-slate-400 block">Owner Name</span>
                <span className="font-semibold text-[#102A43]">
                  {selectedEnquiry.ownerName}
                </span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-slate-400 block">Email & Phone</span>
                <span className="font-semibold text-[#102A43]">
                  {selectedEnquiry.email} • {selectedEnquiry.phone}
                </span>
              </div>
              {selectedEnquiry.existingWebsite && (
                <div className="rounded-xl bg-slate-50 p-3">
                  <span className="text-slate-400 block">Existing Website</span>
                  <span className="font-semibold text-[#3478F6] break-all">
                    {selectedEnquiry.existingWebsite}
                  </span>
                </div>
              )}
              {selectedEnquiry.socialMediaLinks && (
                <div className="rounded-xl bg-slate-50 p-3">
                  <span className="text-slate-400 block">Social Media</span>
                  <span className="font-semibold text-[#102A43]">
                    {selectedEnquiry.socialMediaLinks}
                  </span>
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-bold text-[#102A43] mb-2">
                Selected Services ({selectedEnquiry.selectedServiceNames.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedEnquiry.selectedServiceNames.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 rounded-full bg-blue-50 text-[#102A43] text-xs font-semibold border border-blue-100"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {selectedEnquiry.businessGoals && (
                <div>
                  <p className="font-bold text-[#102A43]">Business Goals</p>
                  <p className="mt-1 text-slate-600 leading-relaxed">
                    {selectedEnquiry.businessGoals}
                  </p>
                </div>
              )}
              <div>
                <p className="font-bold text-[#102A43]">
                  Project Requirements
                </p>
                <p className="mt-1 text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-3 border border-slate-100">
                  {selectedEnquiry.projectRequirements}
                </p>
              </div>
              {selectedEnquiry.additionalMessage && (
                <div>
                  <p className="font-bold text-[#102A43]">
                    Additional Message
                  </p>
                  <p className="mt-1 text-slate-600">
                    {selectedEnquiry.additionalMessage}
                  </p>
                </div>
              )}
            </div>

            {selectedEnquiry.status !== 'Converted' && (
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleStatusChange(selectedEnquiry.id, 'Under Review')
                    }
                    className="px-3 py-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold hover:bg-amber-100"
                  >
                    Mark Under Review
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleStatusChange(selectedEnquiry.id, 'Accepted')
                    }
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Accept</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleStatusChange(selectedEnquiry.id, 'Rejected')
                    }
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-xs font-semibold"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>

                {selectedEnquiry.status !== 'Rejected' && (
                  <button
                    type="button"
                    onClick={() => openConvertModal(selectedEnquiry)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3478F6] hover:bg-blue-700 text-white text-xs font-semibold"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>Convert to Project</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Convert Enquiry to Project Modal */}
      {convertTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 page-enter">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-lg font-bold text-[#102A43]">
                Convert Enquiry to Project
              </h2>
              <button
                type="button"
                onClick={() => setConvertTarget(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConvertSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Target Deadline *
                </label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-2">
                  Assign Team Members
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {teamMembers.map((member) => {
                    const checked = assignedTeamIds.includes(member.id);
                    return (
                      <label
                        key={member.id}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleTeamSelection(member.id)}
                          className="rounded text-[#3478F6]"
                        />
                        <div>
                          <p className="text-xs font-bold text-[#102A43]">
                            {member.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {member.teamTitle}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConvertTarget(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#3478F6] hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  Create Project & Notify Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
