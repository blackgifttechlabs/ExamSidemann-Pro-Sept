import React from 'react';
import { LogOut, X } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-2xl w-full max-w-sm p-6 border border-gray-100 dark:border-white/10 animate-pop-bounce">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[#ff7400]/10 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4 text-[#ff7400] dark:text-red-400">
            <LogOut size={32} />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Sign Out?
          </h3>
          
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
            Are you sure you want to end your session? You will need to sign in again to access your dashboard.
          </p>

          <div className="flex gap-3 w-full">
            <button 
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff7400] to-[#ff7400] hover:from-[#e66a00] hover:to-[#e66a00] text-white font-bold text-sm shadow-lg shadow-[#ff7400]/20 transition-colors"
            >
              Yes, Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
