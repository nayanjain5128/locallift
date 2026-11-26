import React, { useState } from 'react';
import { Edit3, Plus, Trash2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  addService,
  deleteService,
  updateService,
} from '../../services/storageService';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import type { ServiceCategory, ServiceItem } from '../../types';

const CATEGORIES: ServiceCategory[] = [
  'Website Services',
  'Social Media',
  'Digital Marketing',
  'Additional Services',
];

export const AdminServicesPage: React.FC = () => {
  const { db, refreshData, showToast } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ServiceItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ServiceItem | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('Website Services');
  const [description, setDescription] = useState('');
  const [deliverablesText, setDeliverablesText] = useState('');

  const openAdd = () => {
    setEditing(null);
    setName('');
    setCategory('Website Services');
    setDescription('');
    setDeliverablesText('');
    setShowModal(true);
  };

  const openEdit = (srv: ServiceItem) => {
    setEditing(srv);
    setName(srv.name);
    setCategory(srv.category);
    setDescription(srv.description);
    setDeliverablesText(srv.deliverables.join(', '));
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;
    const deliverables = deliverablesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editing) {
      updateService(editing.id, {
        name: name.trim(),
        category,
        description: description.trim(),
        deliverables,
      });
      showToast('Service Updated', 'success', 'Changes reflect on public Services page.');
    } else {
      addService({
        name: name.trim(),
        category,
        description: description.trim(),
        deliverables,
      });
      showToast('Service Added', 'success', 'Now selectable in Package Builder.');
    }
    refreshData();
    setShowModal(false);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteService(deleteTarget.id);
    refreshData();
    setDeleteTarget(null);
    showToast('Service Removed', 'info');
  };

  return (
    <div className="space-y-6 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#102A43]">
            Services Management
          </h1>
          <p className="text-sm text-slate-600">
            Add, edit, toggle, or remove services shown in the public catalog and custom package builder.
          </p>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3478F6] hover:bg-blue-700 text-white text-xs font-semibold shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      <div className="space-y-6">
        {CATEGORIES.map((cat) => {
          const items = db.services.filter((s) => s.category === cat);
          return (
            <div
              key={cat}
              className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs"
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <h2 className="text-base font-bold text-[#102A43]">{cat}</h2>
                <span className="text-xs font-semibold text-slate-500">
                  {items.length} service(s)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {items.map((srv) => (
                  <div
                    key={srv.id}
                    className={`rounded-xl border p-4 flex flex-col justify-between ${
                      srv.active
                        ? 'border-slate-200 bg-white'
                        : 'border-slate-200 bg-slate-50 opacity-70'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-bold text-[#102A43]">
                          {srv.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => {
                            updateService(srv.id, { active: !srv.active });
                            refreshData();
                            showToast(
                              srv.active ? 'Service hidden' : 'Service activated',
                              'info'
                            );
                          }}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            srv.active
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {srv.active ? 'Active' : 'Hidden'}
                        </button>
                      </div>
                      <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                        {srv.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(srv)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-[#102A43] hover:bg-slate-50"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(srv)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 page-enter">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-lg font-bold text-[#102A43]">
                {editing ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as ServiceCategory)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Key Deliverables (comma-separated)
                </label>
                <input
                  type="text"
                  value={deliverablesText}
                  onChange={(e) => setDeliverablesText(e.target.value)}
                  placeholder="e.g., Responsive UI, Contact Form, SEO Setup"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#3478F6] text-white text-xs font-semibold"
                >
                  {editing ? 'Save Changes' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Remove Service?"
        description={`Are you sure you want to remove "${deleteTarget?.name}" from the service catalog?`}
        confirmLabel="Remove Service"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
