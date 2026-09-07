import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-24 right-4 z-[1000] animate-slide-in-right">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border ${
        type === 'success' 
          ? 'bg-white dark:bg-[#1a1a1a] border-green-500/20 text-green-600 dark:text-green-400' 
          : 'bg-white dark:bg-[#1a1a1a] border-red-500/20 text-[#ff7400] dark:text-red-400'
      }`}>
        {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
        <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{message}</p>
        <button onClick={onClose} className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
          <X size={14} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
};
