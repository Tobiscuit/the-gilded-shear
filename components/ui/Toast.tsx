'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ 
  message, 
  type = 'info', 
  isVisible, 
  onClose, 
  duration = 3000 
}: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl min-w-[300px] max-w-[90vw]"
          style={{
            backgroundColor: '#112240', // Slightly lighter than main bg
            border: '1px solid rgba(200, 164, 110, 0.2)', // Gold border
            boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)'
          }}
        >
          {/* Icon based on type */}
          <div className={`p-2 rounded-full ${
            type === 'success' ? 'bg-green-500/10 text-green-400' :
            type === 'error' ? 'bg-red-500/10 text-red-400' :
            'bg-[#c8a46e]/10 text-[#c8a46e]'
          }`}>
            <span className="material-symbols-outlined text-xl">
              {type === 'success' ? 'check_circle' :
               type === 'error' ? 'error' :
               'notifications'}
            </span>
          </div>

          <div className="flex-1">
            <p className="text-white font-medium text-sm">{message}</p>
          </div>

          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
