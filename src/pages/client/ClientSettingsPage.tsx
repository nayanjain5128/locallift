import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BUSINESS_CATEGORIES } from '../../data/seedData';
import { updateUserProfile } from '../../services/storageService';

export const ClientSettingsPage: React.FC = () => {
  const { currentUser, refreshData, showToast } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [businessName, setBusinessName] = useState(
    currentUser?.businessName || ''
  );
  const [businessCategory, setBusinessCategory] = useState(
    currentUser?.businessCategory || BUSINESS_CATEGORIES[0]
  );
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [website, setWebsite] = useState(currentUser?.website || '');
  const [socialLinks, setSocialLinks] = useState(
    currentUser?.socialLinks || ''
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!name.trim() || !businessName.trim()) {
      showToast('Name and business name are required', 'error');
      return;
    }
    updateUserProfile(currentUser.id, {
      name: name.trim(),
      businessName: businessName.trim(),
      businessCategory,
      phone: phone.trim(),
      location: location.trim(),
      website: website.trim(),
      socialLinks: socialLinks.trim(),
    });
    refreshData();
    showToast(
      'Profile Settings Saved',
      'success',
      'Changes persisted to localStorage.'
    );
  };

  return (
    <div className="max-w-3xl space-y-6 page-enter">
      <div>
        <h1 className="text-2xl font-bold text-[#102A43]">Profile Settings</h1>
        <p className="text-sm text-slate-600">
          Keep your business contact details and digital links up to date.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#102A43] mb-1">
              Owner Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#102A43] mb-1">
              Business Name *
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#102A43] mb-1">
              Account Email
            </label>
            <input
              type="email"
              value={currentUser?.email || ''}
              disabled
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#102A43] mb-1">
              Business Category
            </label>
            <select
              value={businessCategory}
              onChange={(e) => setBusinessCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
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
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#102A43] mb-1">
              Location / City
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#102A43] mb-1">
              Existing Website
            </label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#102A43] mb-1">
              Social Media Handle / Link
            </label>
            <input
              type="text"
              value={socialLinks}
              onChange={(e) => setSocialLinks(e.target.value)}
              placeholder="@yourbusiness"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3478F6] hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
