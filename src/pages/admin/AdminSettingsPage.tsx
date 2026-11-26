import React, { useState } from 'react';
import { FolderPlus, RotateCcw, ShieldCheck, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  addPortfolioItem,
  removePortfolioItem,
} from '../../services/storageService';
import { BUSINESS_CATEGORIES } from '../../data/seedData';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const AdminSettingsPage: React.FC = () => {
  const { db, currentUser, resetDemo, refreshData, showToast } = useApp();
  const [confirmReset, setConfirmReset] = useState(false);

  // Genuine Portfolio Publishing Form (defaults empty so Our Work shows clean empty state)
  const [pfTitle, setPfTitle] = useState('');
  const [pfBusiness, setPfBusiness] = useState('');
  const [pfCategory, setPfCategory] = useState(BUSINESS_CATEGORIES[0]);
  const [pfSummary, setPfSummary] = useState('');
  const [pfServices, setPfServices] = useState('');
  const [pfUrl, setPfUrl] = useState('');

  const handleAddPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pfTitle.trim() || !pfBusiness.trim() || !pfSummary.trim()) return;
    addPortfolioItem({
      title: pfTitle.trim(),
      businessName: pfBusiness.trim(),
      category: pfCategory,
      summary: pfSummary.trim(),
      servicesProvided: pfServices
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      liveUrl: pfUrl.trim() || undefined,
      completedAt: new Date().toISOString().slice(0, 10),
    });
    refreshData();
    setPfTitle('');
    setPfBusiness('');
    setPfSummary('');
    setPfServices('');
    setPfUrl('');
    showToast(
      'Portfolio Item Published',
      'success',
      'Now visible on the public Our Work page.'
    );
  };

  return (
    <div className="max-w-4xl space-y-6 page-enter">
      <div>
        <h1 className="text-2xl font-bold text-[#102A43]">Admin Settings</h1>
        <p className="text-sm text-slate-600">
          Manage prototype demonstration data and verified portfolio entries.
        </p>
      </div>

      {/* Admin Account Summary */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-[#102A43] text-white flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-[#FF9F1C]" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#102A43]">
            {currentUser?.name}
          </h2>
          <p className="text-xs text-slate-500">
            {currentUser?.email} • Role: Administrator (Prototype Demo)
          </p>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Data is persisted locally in your browser’s <code className="bg-slate-100 px-1 rounded">localStorage</code>. For production deployment, swap <code className="bg-slate-100 px-1 rounded">src/services/storageService.ts</code> with Supabase or a REST/GraphQL backend.
          </p>
        </div>
      </div>

      {/* Reset Demo Data */}
      <div className="rounded-2xl bg-white border border-amber-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[#102A43]">
              Reset Demonstration Data
            </h2>
            <p className="mt-1 text-xs text-slate-600 max-w-xl leading-relaxed">
              Restores initial sample clients (Sunrise Café, Urban Style Salon, BrightPath Coaching), sample enquiries, projects, milestones, and resets the portfolio showcase to empty.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#102A43] text-xs font-bold shrink-0 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Verified Portfolio Manager */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-5">
        <div>
          <h2 className="text-base font-bold text-[#102A43] flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-[#3478F6]" />
            <span>Verified Portfolio Showcase (Our Work Page)</span>
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            Currently showing <strong>{db.portfolio.length}</strong> published portfolio project(s). When empty, the public Our Work page displays the clean placeholder state.
          </p>
        </div>

        {db.portfolio.length > 0 && (
          <div className="space-y-2">
            {db.portfolio.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3"
              >
                <div>
                  <p className="text-xs font-bold text-[#102A43]">
                    {item.title} — {item.businessName}
                  </p>
                  <p className="text-[11px] text-slate-500">{item.category}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    removePortfolioItem(item.id);
                    refreshData();
                    showToast('Portfolio item removed', 'info');
                  }}
                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                  aria-label="Remove portfolio item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <form
          onSubmit={handleAddPortfolio}
          className="space-y-3 pt-3 border-t border-slate-100"
        >
          <p className="text-xs font-bold text-[#102A43]">
            Publish Genuine Completed Project to Our Work
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={pfTitle}
              onChange={(e) => setPfTitle(e.target.value)}
              placeholder="Project Title *"
              className="rounded-xl border border-slate-300 px-3 py-2 text-xs"
            />
            <input
              type="text"
              value={pfBusiness}
              onChange={(e) => setPfBusiness(e.target.value)}
              placeholder="Verified Client Business Name *"
              className="rounded-xl border border-slate-300 px-3 py-2 text-xs"
            />
            <select
              value={pfCategory}
              onChange={(e) => setPfCategory(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
            >
              {BUSINESS_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={pfServices}
              onChange={(e) => setPfServices(e.target.value)}
              placeholder="Services delivered (comma-separated)"
              className="rounded-xl border border-slate-300 px-3 py-2 text-xs"
            />
          </div>
          <input
            type="text"
            value={pfUrl}
            onChange={(e) => setPfUrl(e.target.value)}
            placeholder="Live Project URL (optional)"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
          />
          <textarea
            rows={2}
            value={pfSummary}
            onChange={(e) => setPfSummary(e.target.value)}
            placeholder="Concise verified project summary *"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#102A43] hover:bg-[#1E3A5F] text-white text-xs font-semibold"
          >
            Add to Portfolio
          </button>
        </form>
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="Reset Prototype Demo Data?"
        description="This will restore all demo accounts, sample enquiries, projects, and milestones to their initial demonstration state. Any newly created test entries will be cleared."
        confirmLabel="Reset Demo Data"
        variant="danger"
        onConfirm={() => {
          resetDemo();
          setConfirmReset(false);
        }}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
};
