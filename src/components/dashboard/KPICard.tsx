import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  id: string;
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  subtitle: string;
  icon: LucideIcon;
  badgeText?: string;
  accentColor?: 'blue' | 'orange' | 'emerald' | 'purple';
}

export const KPICard: React.FC<KPICardProps> = ({
  id,
  title,
  value,
  change,
  isPositive = true,
  subtitle,
  icon: Icon,
  badgeText,
  accentColor = 'blue',
}) => {
  const isEmerald = accentColor === 'emerald' || isPositive;

  return (
    <div
      id={id}
      className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col gap-2 transition hover:shadow-md group"
    >
      <div className="flex items-center justify-between">
        <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider truncate">
          {title}
        </p>
        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#00529C] dark:text-blue-400 group-hover:scale-105 transition-transform shrink-0">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
          {value}
        </p>
        {badgeText && (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {badgeText}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-50 dark:border-slate-800/80 text-xs">
        {change && (
          <div className={`flex items-center gap-1.5 ${isEmerald ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-500'} font-bold`}>
            <span>{change}</span>
            <span className="font-normal text-slate-400 italic">minggu ini</span>
          </div>
        )}
        <span className="text-[11px] text-slate-400 truncate text-right">
          {subtitle}
        </span>
      </div>
    </div>
  );
};
