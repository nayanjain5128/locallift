import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const STATUS_STYLE_MAP: Record<string, string> = {
  // Enquiry statuses
  New: 'bg-blue-50 text-[#3478F6] border-blue-200',
  'Under Review': 'bg-amber-50 text-amber-700 border-amber-200',
  Accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  Converted: 'bg-indigo-50 text-indigo-700 border-indigo-200',

  // Project statuses
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Active: 'bg-blue-50 text-[#3478F6] border-blue-200',
  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',

  // Milestone statuses
  'Not Started': 'bg-slate-100 text-slate-600 border-slate-200',
  'In Progress': 'bg-blue-50 text-[#3478F6] border-blue-200',

  // Roles
  admin: 'bg-[#102A43] text-white border-[#102A43]',
  client: 'bg-blue-50 text-[#3478F6] border-blue-200',
  team: 'bg-orange-50 text-amber-800 border-orange-200',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'sm',
}) => {
  const classes =
    STATUS_STYLE_MAP[status] ||
    'bg-slate-100 text-slate-700 border-slate-200';
  const padding =
    size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border whitespace-nowrap ${padding} ${classes}`}
    >
      {status}
    </span>
  );
};
