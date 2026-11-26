import React from 'react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((t) => {
        const Icon =
          t.type === 'error'
            ? XCircle
            : t.type === 'info'
            ? Info
            : CheckCircle2;
        const borderAccent =
          t.type === 'error'
            ? 'border-l-rose-500'
            : t.type === 'info'
            ? 'border-l-[#3478F6]'
            : 'border-l-emerald-500';
        const iconColor =
          t.type === 'error'
            ? 'text-rose-500'
            : t.type === 'info'
            ? 'text-[#3478F6]'
            : 'text-emerald-500';

        return (
          <div
            key={t.id}
            className={`pointer-events-auto bg-white border border-slate-200 border-l-4 ${borderAccent} rounded-xl shadow-lg p-3.5 flex items-start gap-3 page-enter`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#102A43]">{t.title}</p>
              {t.description && (
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {t.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
