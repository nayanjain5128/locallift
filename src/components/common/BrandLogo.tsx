import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  to?: string;
  darkText?: boolean;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  to = '/',
  darkText = true,
  showTagline = false,
  size = 'md',
}) => {
  const iconBox =
    size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';
  const titleText =
    size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  const content = (
    <span className="inline-flex items-center gap-2.5 group">
      <span
        className={`${iconBox} rounded-xl bg-[#102A43] flex items-center justify-center shadow-sm ring-1 ring-white/10 transition-transform duration-200 group-hover:scale-105`}
      >
        <svg viewBox="0 0 40 40" className="w-6 h-6" fill="none">
          <path d="M11 27V13H16.5V22.5H24.5V27H11Z" fill="#FFFFFF" />
          <path
            d="M20.5 18L27.5 11M27.5 11H22.2M27.5 11V16.3"
            stroke="#FF9F1C"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="27.5" cy="24.5" r="3" fill="#3478F6" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display font-bold tracking-tight ${titleText} ${
            darkText ? 'text-[#102A43]' : 'text-white'
          }`}
        >
          Local<span className="text-[#3478F6]">Lift</span>
        </span>
        {showTagline && (
          <span
            className={`text-[11px] font-medium mt-0.5 ${
              darkText ? 'text-slate-500' : 'text-slate-300'
            }`}
          >
            Your Business. Our Digital Drive.
          </span>
        )}
      </span>
    </span>
  );

  if (!to) return content;
  return (
    <Link to={to} className="inline-flex items-center focus:outline-none">
      {content}
    </Link>
  );
};
