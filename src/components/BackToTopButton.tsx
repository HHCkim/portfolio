import React from 'react';
import { motion, AnimatePresence as FramerAnimatePresence } from 'framer-motion';

// Type assertion to fix AnimatePresence TypeScript issue
const AnimatePresence = FramerAnimatePresence as any;

interface BackToTopButtonProps {
  isVisible: boolean;
  onClick: () => void;
}

const BackToTopButton: React.FC<BackToTopButtonProps> = ({ isVisible, onClick }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClick}
          className="fixed left-[calc(40%/2-24px)] bottom-8 z-40 w-12 h-12 bg-cyan-600/20 backdrop-blur-sm border border-cyan-500/30 rounded-full flex items-center justify-center hover:bg-cyan-600/30 hover:scale-110 transition-all duration-300 cursor-pointer group"
          aria-label="맨 위로 이동"
        >
          <svg 
            className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 10l7-7m0 0l7 7m-7-7v18" 
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTopButton;