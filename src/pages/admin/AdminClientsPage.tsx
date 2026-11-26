import React, { useMemo, useState } from 'react';
import {
  Building2,
  Eye,
  Mail,
  MapPin,
  Phone,
  Search,
  Users,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateProjectProgress } from '../../services/storageService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import type { User } from '../../types';

export const AdminClientsPage: React.FC = () => {
  const { db } = useApp();
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<User | null>(null);

  const clients = useMemo(() => {
    const q = search.trim().toLowerCase();
    return db.users
      .filter((u) => u.role === 'client')
      .filter(
        (c) =>
          !q ||
          c.name.toLowerCase().includes(q) ||
          (c.businessName || '').toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.location || '').toLowerCase().includes(q)
      );
  }, [db.users, search]);

  const clientProjects = useMemo(() => {
    if (!selectedClient) return [];
    return db.projects.filter((p) => p.clientId === selectedClient.id);
  }, [db.projects, selectedClient]);

  const clientEnquiries = useMemo(() => {
    if (!selectedClient) return [];
    return db.enquiries.filter(
      (e) =>
        e.clientId === selectedClient.id ||
        e.email.toLowerCase() === selectedClient.email.toLowerCase()
    );
  }, [db.enquiries, selectedClient]);

  return (
    <div className="space-y-6 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#102A43]">
            Client Management
          </h1>
          <p className="text-sm text-slate-600">
            Browse registered business clients, active projects, selected services, and contact details.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search client or business..."
            className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
          />
        </div>
      </div>

      {clients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No matching clients"
          description="Clients appear here when demo accounts exist, enquiries are converted, or visitors sign up."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {clients.map((client) => {
            const projects = db.projects.filter(
              (p) => p.clientId === client.id
            );
            const servicesSet = new Set(
              projects.flatMap((p) => p.selectedServiceNames)
            );
            return (
              <div
                key={client.id}
                className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#102A43] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {(client.businessName || client.name)
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#102A43]">
                          {client.businessName || 'Business Client'}
                        </h3>
                        <p className="text-xs text-slate-500">{client.name}</p>
                      </div>
                    </div>
                    {client.isDemo && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        Demo
                      </span>
                    )}
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                    <p className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{client.email}</span>
                    </p>
                    {client.phone && (
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{client.phone}</span>
                      </p>
                    )}
                    {client.location && (
                      <p className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{client.location}</span>
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Projects:{' '}
                      <strong className="text-[#102A43]">
                        {projects.length}
                      </strong>
                    </span>
                    <span className="text-slate-500">
                      Services:{' '}
                      <strong className="text-[#102A43]">
                        {servicesSet.size}
                      </strong>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedClient(client)}
                  className="mt-4 w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-[#102A43] transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open Client Profile</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Client Profile Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-5 page-enter max-h-[88vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#102A43] text-white flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#FF9F1C]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#102A43]">
                    {selectedClient.businessName || selectedClient.name}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Owner: {selectedClient.name} •{' '}
                    {selectedClient.businessCategory || 'Local Business'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClient(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-slate-400 block">Email</span>
                <span className="font-semibold text-[#102A43]">
                  {selectedClient.email}
                </span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-slate-400 block">Phone</span>
                <span className="font-semibold text-[#102A43]">
                  {selectedClient.phone || 'Not provided'}
                </span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-slate-400 block">Location</span>
                <span className="font-semibold text-[#102A43]">
                  {selectedClient.location || 'Not provided'}
                </span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-slate-400 block">Web / Social</span>
                <span className="font-semibold text-[#102A43] break-all">
                  {selectedClient.website ||
                    selectedClient.socialLinks ||
                    'Not provided'}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#102A43] mb-2">
                Assigned Projects ({clientProjects.length})
              </h3>
              {clientProjects.length === 0 ? (
                <p className="text-xs text-slate-500">
                  No projects created for this client yet.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {clientProjects.map((p) => {
                    const prog = calculateProjectProgress(p);
                    return (
                      <div
                        key={p.id}
                        className="rounded-xl border border-slate-200 p-3.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-[#102A43]">
                            {p.id} • {p.title}
                          </p>
                          <StatusBadge status={p.status} />
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Progress: {prog.percentage}% ({prog.completedCount}/
                          {prog.totalCount} milestones) • Deadline: {p.deadline}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {p.selectedServiceNames.map((s) => (
                            <span
                              key={s}
                              className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-[#102A43] font-medium"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#102A43] mb-2">
                Enquiry History ({clientEnquiries.length})
              </h3>
              {clientEnquiries.length === 0 ? (
                <p className="text-xs text-slate-500">No enquiries linked.</p>
              ) : (
                <div className="space-y-2">
                  {clientEnquiries.map((e) => (
                    <div
                      key={e.id}
                      className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 px-3.5 py-2.5 text-xs"
                    >
                      <span>
                        <strong>{e.id}</strong> •{' '}
                        {e.selectedServiceNames.length} service(s)
                      </span>
                      <StatusBadge status={e.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
