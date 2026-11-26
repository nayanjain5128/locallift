import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  CheckCircle2,
  ClipboardList,
  Globe,
  Megaphone,
  Plus,
  Send,
  Share2,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BUSINESS_CATEGORIES, PACKAGE_PRESETS } from '../../data/seedData';
import { createEnquiry } from '../../services/storageService';
import type { Enquiry, ServiceCategory } from '../../types';

const CATEGORIES: ServiceCategory[] = [
  'Website Services',
  'Social Media',
  'Digital Marketing',
  'Additional Services',
];

const CATEGORY_ICON_MAP: Record<ServiceCategory, React.FC<{ className?: string }>> = {
  'Website Services': Globe,
  'Social Media': Share2,
  'Digital Marketing': Megaphone,
  'Additional Services': Sparkles,
};

export const ServicesPage: React.FC = () => {
  const { db, currentUser, showToast, refreshData } = useApp();
  const activeServices = useMemo(
    () => db.services.filter((s) => s.active),
    [db.services]
  );

  const [activeCategory, setActiveCategory] = useState<'All' | ServiceCategory>('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'srv-business-website',
    'srv-gbp',
  ]);
  const [selectedPresetName, setSelectedPresetName] = useState<string | null>(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  // Builder & Enquiry Form State
  const [businessCategory, setBusinessCategory] = useState(
    currentUser?.businessCategory || BUSINESS_CATEGORIES[0]
  );
  const [businessGoals, setBusinessGoals] = useState('');
  const [businessName, setBusinessName] = useState(
    currentUser?.businessName || ''
  );
  const [ownerName, setOwnerName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(
    currentUser?.role === 'client' ? currentUser.email : ''
  );
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [existingWebsite, setExistingWebsite] = useState(
    currentUser?.website || ''
  );
  const [socialMediaLinks, setSocialMediaLinks] = useState(
    currentUser?.socialLinks || ''
  );
  const [projectRequirements, setProjectRequirements] = useState('');
  const [additionalMessage, setAdditionalMessage] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submittedEnquiry, setSubmittedEnquiry] = useState<Enquiry | null>(null);

  const selectedServices = useMemo(
    () => activeServices.filter((s) => selectedIds.includes(s.id)),
    [activeServices, selectedIds]
  );

  const visibleCategories =
    activeCategory === 'All' ? CATEGORIES : [activeCategory];

  const toggleService = (serviceId: string) => {
    setSelectedIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
    if (selectedPresetName && !selectedPresetName.includes('(Customized)')) {
      setSelectedPresetName(`${selectedPresetName} (Customized)`);
    }
  };

  const applyPreset = (presetId: string) => {
    const preset = PACKAGE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    const validIds = preset.serviceIds.filter((id) =>
      activeServices.some((s) => s.id === id)
    );
    setSelectedIds(validIds);
    setSelectedPresetName(preset.name);
    showToast(
      `${preset.name} combination applied`,
      'info',
      'You can add or remove any individual service below.'
    );
  };

  const validateEnquiry = (): boolean => {
    const errors: Record<string, string> = {};
    if (selectedServices.length === 0) {
      errors.services = 'Please select at least one service.';
    }
    if (!businessName.trim()) errors.businessName = 'Business name is required.';
    if (!ownerName.trim()) errors.ownerName = 'Owner name is required.';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 7) {
      errors.phone = 'Please enter a valid contact phone number.';
    }
    if (!businessCategory.trim()) {
      errors.businessCategory = 'Select a business category.';
    }
    if (!location.trim()) errors.location = 'Location / city is required.';
    if (!projectRequirements.trim()) {
      errors.projectRequirements =
        'Please describe your project requirements.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEnquiry()) {
      showToast(
        'Please check highlighted fields',
        'error',
        'Complete all required business details before submitting.'
      );
      return;
    }

    const enquiry = createEnquiry({
      businessName: businessName.trim(),
      ownerName: ownerName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      businessCategory: businessCategory.trim(),
      location: location.trim(),
      existingWebsite: existingWebsite.trim() || undefined,
      socialMediaLinks: socialMediaLinks.trim() || undefined,
      selectedServiceIds: selectedServices.map((s) => s.id),
      selectedServiceNames: selectedServices.map((s) => s.name),
      businessGoals: businessGoals.trim() || undefined,
      projectRequirements: projectRequirements.trim(),
      additionalMessage: additionalMessage.trim() || undefined,
      packageBase: selectedPresetName || 'Custom Selection',
      clientId: currentUser?.role === 'client' ? currentUser.id : undefined,
    });

    refreshData();
    setSubmittedEnquiry(enquiry);
    setShowEnquiryModal(false);
    showToast(
      `Enquiry Submitted (${enquiry.id})`,
      'success',
      'Your request is now visible in the LocalLift Admin Dashboard.'
    );
  };

  return (
    <div className="page-enter">
      {/* Header */}
      <section className="bg-[#102A43] text-white py-14 sm:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-wider text-[#FF9F1C]">
            Services & Custom Package Builder
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Build Your Customized Digital Service Request
          </h1>
          <p className="mt-3 text-slate-200 max-w-3xl leading-relaxed">
            Explore our service catalog across web development, social media, digital marketing, and business onboarding. Start with a recommended combination or hand-pick services to submit a tailored business enquiry.
          </p>
        </div>
      </section>

      {/* Submitted Success Banner */}
      {submittedEnquiry && (
        <section className="bg-emerald-50 border-b border-emerald-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-bold text-emerald-950">
                      Business Enquiry Submitted Successfully
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white">
                      {submittedEnquiry.id}
                    </span>
                  </div>
                  <p className="text-sm text-emerald-800 mt-1">
                    Thank you, <strong>{submittedEnquiry.ownerName}</strong>! Your enquiry for{' '}
                    <strong>{submittedEnquiry.businessName}</strong> with{' '}
                    {submittedEnquiry.selectedServiceNames.length} selected service(s) has been logged for agency review.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                {currentUser?.role === 'client' ? (
                  <Link
                    to="/client/dashboard"
                    className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800"
                  >
                    View in Client Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800"
                  >
                    Login to Track
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setSubmittedEnquiry(null)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-emerald-900 hover:bg-emerald-100"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Predefined Service Combinations (No pricing) */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#102A43]">
              Recommended Service Combinations
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Select a starting combination below, then customize it by adding or removing services to match your business goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PACKAGE_PRESETS.map((preset) => {
              const isSelected =
                selectedPresetName === preset.name ||
                selectedPresetName === `${preset.name} (Customized)`;
              const presetServices = activeServices.filter((s) =>
                preset.serviceIds.includes(s.id)
              );
              return (
                <div
                  key={preset.id}
                  className={`rounded-2xl border p-6 bg-white transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#3478F6] ring-2 ring-[#3478F6]/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#102A43] text-white">
                        {preset.name} Combination
                      </span>
                      <span className="text-xs font-semibold text-[#3478F6]">
                        {presetServices.length} Services
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-[#102A43]">
                      {preset.tagline}
                    </h3>
                    <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                      {preset.description}
                    </p>
                    <p className="mt-3 text-xs font-medium text-slate-500">
                      Ideal for: {preset.recommendedFor}
                    </p>
                    <ul className="mt-4 space-y-1.5">
                      {presetServices.slice(0, 5).map((srv) => (
                        <li
                          key={srv.id}
                          className="flex items-center gap-2 text-xs text-slate-700"
                        >
                          <Check className="w-3.5 h-3.5 text-[#3478F6] shrink-0" />
                          <span>{srv.name}</span>
                        </li>
                      ))}
                      {presetServices.length > 5 && (
                        <li className="text-xs font-semibold text-[#3478F6] pl-5">
                          + {presetServices.length - 5} more services included
                        </li>
                      )}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => applyPreset(preset.id)}
                    className={`mt-6 w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      isSelected
                        ? 'bg-[#3478F6] text-white'
                        : 'bg-slate-100 hover:bg-[#102A43] text-[#102A43] hover:text-white'
                    }`}
                  >
                    {isSelected ? 'Selected — Customize Below' : `Select ${preset.name} Combination`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Service Selection + Custom Package Builder */}
      <section id="builder" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Service Catalog */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#102A43]">
                    Interactive Service Catalog
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Click any service card to include or remove it from your custom enquiry package.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(['All', ...CATEGORIES] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                        activeCategory === cat
                          ? 'bg-[#102A43] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {visibleCategories.map((category) => {
                const items = activeServices.filter((s) => s.category === category);
                if (items.length === 0) return null;
                const CatIcon = CATEGORY_ICON_MAP[category];
                return (
                  <div key={category} className="space-y-4">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#3478F6] flex items-center justify-center">
                        <CatIcon className="w-4 h-4" />
                      </div>
                      <h3 className="text-lg font-bold text-[#102A43]">
                        {category}
                      </h3>
                      <span className="text-xs font-medium text-slate-400">
                        ({items.length})
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {items.map((srv) => {
                        const selected = selectedIds.includes(srv.id);
                        return (
                          <button
                            key={srv.id}
                            type="button"
                            onClick={() => toggleService(srv.id)}
                            className={`text-left rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                              selected
                                ? 'border-[#3478F6] bg-blue-50/40 ring-2 ring-[#3478F6]/15 shadow-xs'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                            }`}
                          >
                            <div>
                              <div className="flex items-start justify-between gap-3">
                                <h4 className="text-sm font-bold text-[#102A43]">
                                  {srv.name}
                                </h4>
                                <span
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                    selected
                                      ? 'bg-[#3478F6] text-white'
                                      : 'bg-slate-100 text-slate-500'
                                  }`}
                                >
                                  {selected ? (
                                    <Check className="w-4 h-4" />
                                  ) : (
                                    <Plus className="w-4 h-4" />
                                  )}
                                </span>
                              </div>
                              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                                {srv.description}
                              </p>
                            </div>

                            {srv.deliverables.length > 0 && (
                              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                                {srv.deliverables.map((del) => (
                                  <span
                                    key={del}
                                    className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600"
                                  >
                                    {del}
                                  </span>
                                ))}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Sticky Custom Package Builder Summary */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-[#3478F6]" />
                    <h3 className="text-base font-bold text-[#102A43]">
                      Custom Package Builder
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#102A43] text-white">
                    {selectedServices.length} Selected
                  </span>
                </div>

                {selectedPresetName && (
                  <p className="mt-3 text-xs font-semibold text-[#3478F6]">
                    Base Combination: {selectedPresetName}
                  </p>
                )}

                <div className="mt-4">
                  {selectedServices.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-center text-xs text-slate-500">
                      Select services from the catalog on the left to start building your custom request.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {selectedServices.map((srv) => (
                        <div
                          key={srv.id}
                          className="flex items-center justify-between gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-[#102A43] truncate">
                              {srv.name}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {srv.category}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleService(srv.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded"
                            aria-label={`Remove ${srv.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 space-y-3 pt-4 border-t border-slate-200">
                  <div>
                    <label className="block text-xs font-semibold text-[#102A43] mb-1">
                      Business Category
                    </label>
                    <select
                      value={businessCategory}
                      onChange={(e) => setBusinessCategory(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
                    >
                      {BUSINESS_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#102A43] mb-1">
                      Business Goals (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={businessGoals}
                      onChange={(e) => setBusinessGoals(e.target.value)}
                      placeholder="e.g., Launch mobile-friendly site & grow local Google Maps visibility..."
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={selectedServices.length === 0}
                  onClick={() => setShowEnquiryModal(true)}
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#3478F6] hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Customized Request</span>
                </button>
                <p className="mt-2.5 text-[11px] text-slate-500 text-center">
                  Submitting generates an enquiry for agency review—not a paid purchase.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Enquiry Form Modal */}
      {showEnquiryModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 backdrop-blur-xs p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full my-8 overflow-hidden page-enter">
            <div className="px-6 py-5 bg-[#102A43] text-white flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  Complete Your Service Enquiry
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  {selectedServices.length} selected service(s) • Saved to LocalLift prototype portal
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowEnquiryModal(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:bg-white/10"
                aria-label="Close enquiry modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmitEnquiry}
              className="p-6 space-y-4 max-h-[78vh] overflow-y-auto"
            >
              {/* Selected Services Pills */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5">
                <p className="text-xs font-bold text-[#102A43] mb-2">
                  Selected Services ({selectedServices.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedServices.map((s) => (
                    <span
                      key={s.id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-xs font-medium text-[#102A43]"
                    >
                      {s.name}
                      <button
                        type="button"
                        onClick={() => toggleService(s.id)}
                        className="text-slate-400 hover:text-rose-600"
                        aria-label={`Deselect ${s.name}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                {formErrors.services && (
                  <p className="text-xs text-rose-600 mt-1.5">
                    {formErrors.services}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g., Sunrise Café"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
                  />
                  {formErrors.businessName && (
                    <p className="text-xs text-rose-600 mt-1">
                      {formErrors.businessName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Owner / Contact Name *
                  </label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g., Rohan Kapoor"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
                  />
                  {formErrors.ownerName && (
                    <p className="text-xs text-rose-600 mt-1">
                      {formErrors.ownerName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@business.example"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
                  />
                  {formErrors.email && (
                    <p className="text-xs text-rose-600 mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
                  />
                  {formErrors.phone && (
                    <p className="text-xs text-rose-600 mt-1">
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Business Category *
                  </label>
                  <select
                    value={businessCategory}
                    onChange={(e) => setBusinessCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
                  >
                    {BUSINESS_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Location / City *
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Indiranagar, Bengaluru"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
                  />
                  {formErrors.location && (
                    <p className="text-xs text-rose-600 mt-1">
                      {formErrors.location}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Existing Website (Optional)
                  </label>
                  <input
                    type="text"
                    value={existingWebsite}
                    onChange={(e) => setExistingWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Social Media Links (Optional)
                  </label>
                  <input
                    type="text"
                    value={socialMediaLinks}
                    onChange={(e) => setSocialMediaLinks(e.target.value)}
                    placeholder="Instagram / Facebook handle"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Project Requirements *
                </label>
                <textarea
                  rows={3}
                  value={projectRequirements}
                  onChange={(e) => setProjectRequirements(e.target.value)}
                  placeholder="Describe what you need built or improved..."
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
                />
                {formErrors.projectRequirements && (
                  <p className="text-xs text-rose-600 mt-1">
                    {formErrors.projectRequirements}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Additional Message / Goals (Optional)
                </label>
                <textarea
                  rows={2}
                  value={additionalMessage}
                  onChange={(e) => setAdditionalMessage(e.target.value)}
                  placeholder="Preferred timeline, references, or questions..."
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEnquiryModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3478F6] hover:bg-blue-700 text-white text-sm font-semibold shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Business Enquiry</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
