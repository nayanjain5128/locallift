import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Clock,
  FolderKanban,
  Inbox,
  Mail,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateProjectProgress } from '../../services/storageService';
import { StatusBadge } from '../../components/common/StatusBadge';
import type { EnquiryStatus, ProjectStatus } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const { db } = useApp();

  const clients = useMemo(
    () => db.users.filter((u) => u.role === 'client'),
    [db.users]
  );

  const stats = useMemo(() => {
    const totalEnquiries = db.enquiries.length;
    const newEnquiries = db.enquiries.filter((e) => e.status === 'New').length;
    const activeProjects = db.projects.filter(
      (p) => p.status === 'Active'
    ).length;
    const pendingProjects = db.projects.filter(
      (p) => p.status === 'Pending'
    ).length;
    const completedProjects = db.projects.filter(
      (p) => p.status === 'Completed'
    ).length;

    return {
      totalEnquiries,
      totalClients: clients.length,
      newEnquiries,
      activeProjects,
      pendingProjects,
      completedProjects,
    };
  }, [db.enquiries, db.projects, clients]);

  const enquiryBreakdown: Array<{ status: EnquiryStatus; color: string }> = [
    { status: 'New', color: 'bg-[#3478F6]' },
    { status: 'Under Review', color: 'bg-[#FF9F1C]' },
    { status: 'Accepted', color: 'bg-emerald-500' },
    { status: 'Converted', color: 'bg-indigo-500' },
    { status: 'Rejected', color: 'bg-rose-500' },
  ];

  const projectBreakdown: Array<{ status: ProjectStatus; color: string }> = [
    { status: 'Active', color: 'bg-[#3478F6]' },
    { status: 'Pending', color: 'bg-[#FF9F1C]' },
    { status: 'Completed', color: 'bg-emerald-500' },
  ];

  const maxEnquiryCount = Math.max(
    1,
    ...enquiryBreakdown.map(
      (item) => db.enquiries.filter((e) => e.status === item.status).length
    )
  );

  const hasDemoRecords =
    db.enquiries.some((e) => e.isDemo) || db.projects.some((p) => p.isDemo);

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-[#102A43]">
              Admin Agency Overview
            </h1>
            {hasDemoRecords && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                Includes Prototype Demo Data
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 mt-0.5">
            Live metrics computed directly from current application records in localStorage.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/enquiries"
            className="px-4 py-2 rounded-xl bg-[#3478F6] hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
          >
            Review Enquiries
          </Link>
          <Link
            to="/admin/projects"
            className="px-4 py-2 rounded-xl bg-[#102A43] hover:bg-[#1E3A5F] text-white text-xs font-semibold transition-colors"
          >
            Manage Projects
          </Link>
        </div>
      </div>

      {/* 6 Required Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          {
            label: 'Total Enquiries',
            value: stats.totalEnquiries,
            icon: ClipboardList,
            accent: 'text-[#3478F6] bg-blue-50',
          },
          {
            label: 'New Enquiries',
            value: stats.newEnquiries,
            icon: Inbox,
            accent: 'text-[#FF9F1C] bg-orange-50',
          },
          {
            label: 'Total Clients',
            value: stats.totalClients,
            icon: Users,
            accent: 'text-[#102A43] bg-slate-100',
          },
          {
            label: 'Active Projects',
            value: stats.activeProjects,
            icon: FolderKanban,
            accent: 'text-[#3478F6] bg-blue-50',
          },
          {
            label: 'Pending Projects',
            value: stats.pendingProjects,
            icon: Clock,
            accent: 'text-amber-700 bg-amber-50',
          },
          {
            label: 'Completed Projects',
            value: stats.completedProjects,
            icon: CheckCircle2,
            accent: 'text-emerald-700 bg-emerald-50',
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl bg-white border border-slate-200 p-4 shadow-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-500">
                  {card.label}
                </span>
                <span className={`p-2 rounded-xl ${card.accent}`}>
                  <Icon className="w-4 h-4" />
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-[#102A43]">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enquiry Pipeline Chart */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-[#102A43]">
                Enquiry Pipeline Breakdown
              </h2>
              <p className="text-xs text-slate-500">
                Count across current enquiry statuses
              </p>
            </div>
            <Link
              to="/admin/enquiries"
              className="text-xs font-semibold text-[#3478F6] hover:underline inline-flex items-center gap-1"
            >
              Open <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {enquiryBreakdown.map((item) => {
              const count = db.enquiries.filter(
                (e) => e.status === item.status
              ).length;
              const widthPct = Math.round((count / maxEnquiryCount) * 100);
              return (
                <div key={item.status}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-[#102A43]">
                      {item.status}
                    </span>
                    <span className="font-bold text-slate-700">{count}</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${item.color}`}
                      style={{ width: `${count === 0 ? 0 : Math.max(8, widthPct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Project Status Chart */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-[#102A43]">
                Project Delivery Overview
              </h2>
              <p className="text-xs text-slate-500">
                Current projects and milestone completion rates
              </p>
            </div>
            <Link
              to="/admin/projects"
              className="text-xs font-semibold text-[#3478F6] hover:underline inline-flex items-center gap-1"
            >
              Manage <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5">
            {projectBreakdown.map((item) => {
              const count = db.projects.filter(
                (p) => p.status === item.status
              ).length;
              return (
                <div
                  key={item.status}
                  className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-center"
                >
                  <p className="text-xl font-bold text-[#102A43]">{count}</p>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    {item.status}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="space-y-3">
            {db.projects.slice(0, 4).map((prj) => {
              const prog = calculateProjectProgress(prj);
              return (
                <div key={prj.id} className="space-y-1">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-[#102A43] truncate">
                      {prj.businessName} — {prj.title}
                    </span>
                    <span className="font-bold text-[#3478F6] shrink-0">
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
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Enquiries & Contact Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[#102A43]">
              Latest Enquiries
            </h2>
            <Link
              to="/admin/enquiries"
              className="text-xs font-semibold text-[#3478F6] hover:underline"
            >
              View all ({db.enquiries.length})
            </Link>
          </div>
          <div className="space-y-2.5">
            {db.enquiries.slice(0, 5).map((enq) => (
              <div
                key={enq.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#102A43]">
                      {enq.businessName}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {enq.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">
                    {enq.ownerName} • {enq.selectedServiceNames.length} service(s) •{' '}
                    {enq.location}
                  </p>
                </div>
                <StatusBadge status={enq.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-4 h-4 text-[#3478F6]" />
            <h2 className="text-base font-bold text-[#102A43]">
              Contact & Support Messages ({db.contactMessages.length})
            </h2>
          </div>
          {db.contactMessages.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              Messages submitted via the public Contact & Help page will appear here.
            </p>
          ) : (
            <div className="space-y-2.5 max-h-72 overflow-y-auto">
              {db.contactMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="rounded-xl bg-slate-50 border border-slate-100 p-3.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#102A43]">
                      {msg.subject}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-[#3478F6]">
                      {msg.type}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">{msg.message}</p>
                  <p className="mt-1.5 text-[10px] text-slate-400">
                    {msg.name} ({msg.email})
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
