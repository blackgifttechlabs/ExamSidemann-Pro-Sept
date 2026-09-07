import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

export const FloatingWhatsAppBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-20 lg:bottom-8 right-6 z-[200]">
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-green-600 transition-all hover:scale-105 animate-bounce shadow-green-500/30"
          title="Chat with our AI Bot"
        >
          <MessageCircle size={30} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[201]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-40 lg:bottom-28 right-6 w-[90vw] max-w-[350px] bg-white dark:bg-[#121212] rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.2)] z-[202] overflow-hidden border border-gray-100 dark:border-white/10"
            >
              <div className="bg-green-500 p-4 text-white relative">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">
                      Exam Sidemann Bot
                    </h3>
                    <p className="text-sm text-green-100">
                      Usually replies instantly
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6 rounded-2xl overflow-hidden shadow-md bg-gray-100 dark:bg-gray-800">
                  <img
                    src="/images/site/sidebot.jpg"
                    alt="SideBot Features"
                    className="w-full h-auto object-cover"
                  />
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 font-medium leading-relaxed">
                  We are about to take you to WhatsApp where you can chat with
                  this bot. It can help you generate practice papers, answer
                  questions, and guide you through your studies!
                </p>

                <button
                  onClick={() => {
                    window.open("https://wa.me/263713952798", "_blank");
                    setIsOpen(false);
                  }}
                  className="w-full py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 transition-all active:scale-[0.98] flex justify-center items-center gap-2"
                >
                  <MessageCircle size={18} />
                  Continue to WhatsApp
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
