import React, { useMemo } from 'react';
import { BarChart3, CheckCircle2, Clock, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateProjectProgress } from '../../services/storageService';
import { StatusBadge } from '../../components/common/StatusBadge';
import type { EnquiryStatus } from '../../types';

export const AdminReportsPage: React.FC = () => {
  const { db } = useApp();

  const enquiryStats = useMemo(() => {
    const statuses: EnquiryStatus[] = [
      'New',
      'Under Review',
      'Accepted',
      'Rejected',
      'Converted',
    ];
    return statuses.map((st) => ({
      status: st,
      count: db.enquiries.filter((e) => e.status === st).length,
    }));
  }, [db.enquiries]);

  const completedProjects = useMemo(
    () => db.projects.filter((p) => p.status === 'Completed'),
    [db.projects]
  );

  const pendingOrActiveProjects = useMemo(
    () => db.projects.filter((p) => p.status !== 'Completed'),
    [db.projects]
  );

  const teamWorkload = useMemo(() => {
    return db.users
      .filter((u) => u.role === 'team')
      .map((member) => {
        const assigned = db.projects.filter((p) =>
          p.assignedTeamIds.includes(member.id)
        );
        const activeCount = assigned.filter(
          (p) => p.status !== 'Completed'
        ).length;
        const completedCount = assigned.filter(
          (p) => p.status === 'Completed'
        ).length;
        return {
          member,
          total: assigned.length,
          activeCount,
          completedCount,
        };
      });
  }, [db.users, db.projects]);

  return (
    <div className="space-y-6 page-enter">
      <div>
        <h1 className="text-2xl font-bold text-[#102A43]">
          Reports & Operational Summary
        </h1>
        <p className="text-sm text-slate-600">
          All statistics below are calculated live from current localStorage records.
        </p>
      </div>

      {/* Enquiry & Project Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-[#3478F6]" />
            <h2 className="text-base font-bold text-[#102A43]">
              Enquiry Statistics (Total: {db.enquiries.length})
            </h2>
          </div>

          <div className="space-y-3">
            {enquiryStats.map((item) => {
              const pct =
                db.enquiries.length > 0
                  ? Math.round((item.count / db.enquiries.length) * 100)
                  : 0;
              return (
                <div key={item.status} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#102A43]">
                      {item.status}
                    </span>
                    <span className="text-slate-600 font-medium">
                      {item.count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#3478F6]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Workload */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-[#FF9F1C]" />
            <h2 className="text-base font-bold text-[#102A43]">
              Team Workload Breakdown
            </h2>
          </div>

          <div className="space-y-3">
            {teamWorkload.map(({ member, total, activeCount, completedCount }) => (
              <div
                key={member.id}
                className="rounded-xl bg-slate-50 border border-slate-100 p-3.5 flex items-center justify-between gap-3"
              >
                <div>
                  <p className="text-xs font-bold text-[#102A43]">
                    {member.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {member.teamTitle}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#3478F6] font-semibold">
                    {activeCount} Active/Pending
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold">
                    {completedCount} Done
                  </span>
                  <span className="text-slate-500 font-semibold">
                    ({total} total)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending / Active vs Completed Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-[#FF9F1C]" />
            <h2 className="text-base font-bold text-[#102A43]">
              Pending & Active Projects ({pendingOrActiveProjects.length})
            </h2>
          </div>
          {pendingOrActiveProjects.length === 0 ? (
            <p className="text-xs text-slate-500">No pending or active projects.</p>
          ) : (
            <div className="space-y-2.5">
              {pendingOrActiveProjects.map((p) => {
                const prog = calculateProjectProgress(p);
                return (
                  <div
                    key={p.id}
                    className="rounded-xl border border-slate-200 p-3.5 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#102A43] truncate">
                        {p.title}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {p.businessName} • Due {p.deadline} • {prog.percentage}%
                      </p>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-[#102A43]">
              Completed Projects ({completedProjects.length})
            </h2>
          </div>
          {completedProjects.length === 0 ? (
            <p className="text-xs text-slate-500">
              No projects marked completed yet.
            </p>
          ) : (
            <div className="space-y-2.5">
              {completedProjects.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3.5 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#102A43] truncate">
                      {p.title}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {p.businessName} • {p.selectedServiceNames.length}{' '}
                      service(s)
                    </p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
