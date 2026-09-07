
import React from 'react';
import { LogIn } from 'lucide-react';

interface LoginRequiredViewProps {
  onLoginRequest?: () => void;
  featureName?: string;
}

export const LoginRequiredView: React.FC<LoginRequiredViewProps> = ({ onLoginRequest, featureName = "this feature" }) => {
  return (
    <section className="bg-gray-50 dark:bg-navy-950 py-12 font-sans min-h-[calc(100vh_-_var(--app-header-h))] flex flex-col items-center justify-center animate-dropdown-reveal">
         <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center text-center">
                <div className="bg-white dark:bg-navy-900 rounded-[40px] shadow-2xl p-8 md:p-12 max-w-2xl w-full flex flex-col items-center border border-gray-100 dark:border-navy-800">
                    <div 
                        className="w-full h-[300px] md:h-[400px] bg-center bg-no-repeat bg-contain mb-8"
                        style={{ backgroundImage: "url('https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif')" }}
                    >
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Restricted</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                        You need to be logged in to access {featureName}. Join Exam Sidemann to unlock full potential.
                    </p>
                    <button 
                        onClick={onLoginRequest} 
                        className="group flex items-center justify-center gap-3 text-white px-10 py-4 bg-orange-500 hover:bg-orange-600 rounded-full shadow-lg shadow-orange-500/30 transition-all duration-300 font-bold text-lg transform hover:-translate-y-1"
                    >
                        <LogIn size={24} className="group-hover:scale-110 transition-transform" />
                        <span>Login to Continue</span>
                    </button>
                </div>
            </div>
        </div>
    </section>
  );
};
