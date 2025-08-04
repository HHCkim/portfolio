import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence as FramerAnimatePresence } from 'framer-motion';

// Type assertion to fix AnimatePresence TypeScript issue
const AnimatePresence = FramerAnimatePresence as any;

const ScrollInstruction: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide the instruction after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    // Also hide if user starts scrolling
    const handleScroll = () => {
      setIsVisible(false);
    };

    // Find the scroll container
    const scrollContainer = document.querySelector('.overflow-y-auto');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      clearTimeout(timer);
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="fixed top-8 left-0 w-[40%] z-50 pointer-events-none flex justify-center"
        >
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-6 py-4 pointer-events-auto">
            <motion.div
              className="text-white text-center flex items-center gap-3"
            >
              <p className="text-sm">스크롤하여 포트폴리오를 탐색하세요</p>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                  />
                </svg>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollInstruction;