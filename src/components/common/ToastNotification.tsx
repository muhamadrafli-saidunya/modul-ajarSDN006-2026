import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-[#00529B] dark:text-blue-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-[#FF7300] dark:text-amber-400 shrink-0" />,
  };

  const bgStyles = {
    success: 'border-emerald-200 bg-emerald-50 dark:bg-emerald-950/70 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100',
    error: 'border-rose-200 bg-rose-50 dark:bg-rose-950/70 dark:border-rose-800 text-rose-900 dark:text-rose-100',
    info: 'border-blue-200 bg-blue-50 dark:bg-slate-900/90 dark:border-blue-800 text-blue-950 dark:text-blue-100',
    warning: 'border-amber-200 bg-amber-50 dark:bg-amber-950/70 dark:border-amber-800 text-amber-950 dark:text-amber-100',
  };

  return (
    <div
      id="toast-notification-container"
      className="fixed bottom-5 right-5 z-50 max-w-md w-full px-4 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md ${bgStyles[toast.type]}`}
      >
        {icons[toast.type]}
        <div className="flex-1 text-sm font-medium leading-snug">{toast.text}</div>
      </div>
    </div>
  );
};
