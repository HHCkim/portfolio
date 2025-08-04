import React, { useEffect, useState, Fragment } from 'react';
import { motion, AnimatePresence as FramerAnimatePresence } from 'framer-motion';
import headerContent from '../data/headerContent.json';

// Type assertion to fix AnimatePresence TypeScript issue
const AnimatePresence = FramerAnimatePresence as any;

interface HeaderTextDisplayProps {
  isActive: boolean;
}

const HeaderTextDisplay: React.FC<HeaderTextDisplayProps> = ({ isActive }) => {
  const [currentHighlight, setCurrentHighlight] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setCurrentHighlight((prev) => (prev + 1) % headerContent.highlights.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isActive]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    }
  };

  const highlightVariants = {
    initial: { 
      scale: 1, 
      opacity: 1,
      boxShadow: "0 0 0 0 rgba(6, 182, 212, 0)"
    },
    animate: { 
      scale: [1, 1.05, 1],
      opacity: 1,
      boxShadow: [
        "0 0 0 0 rgba(6, 182, 212, 0)",
        "0 0 20px 10px rgba(6, 182, 212, 0.3)",
        "0 0 0 0 rgba(6, 182, 212, 0)"
      ],
      transition: {
        duration: 2,
        times: [0, 0.5, 1],
        ease: "easeInOut"
      }
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const skillChipVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 200
      }
    }
  };

  return (
    <div className="w-3/5 h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* 배경 애니메이션 효과 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-700 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-700 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-700 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {isActive && (
        <>
          <AnimatePresence mode="wait">
            <motion.div
            className="relative z-10 max-w-2xl mx-auto px-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            key="header-content"
          >
            {/* 이름과 역할 */}
            <motion.div variants={itemVariants} className="mb-8 text-center">
              <h2 className="text-5xl font-bold text-gray-100 mb-2">
                {headerContent.introduction.name}
              </h2>
              <p className="text-xl text-cyan-400">
                {headerContent.introduction.role}
              </p>
              <p className="text-lg text-gray-400 mt-2">
                경력 {headerContent.introduction.experience}
              </p>
            </motion.div>

            {/* 하이라이트 통계 */}
            <motion.div 
              variants={itemVariants} 
              className="grid grid-cols-2 gap-4 mb-8"
            >
              {headerContent.highlights.map((highlight, index) => (
                <motion.div
                  key={highlight.label}
                  variants={highlightVariants}
                  initial="visible"
                  animate={currentHighlight === index ? "animate" : "visible"}
                  whileHover={{ scale: 1.02 }}
                  className={`
                    p-4 rounded-lg backdrop-blur-sm transition-all duration-500 cursor-pointer
                    ${currentHighlight === index 
                      ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20' 
                      : 'bg-gray-800/30 border border-gray-700/30 hover:bg-gray-800/40'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{highlight.icon}</span>
                    <div>
                      <p className="text-2xl font-bold text-gray-100">
                        {highlight.value}
                      </p>
                      <p className="text-sm text-gray-400">
                        {highlight.label}
                      </p>
                    </div>
                  </div>
                  <AnimatePresence mode="wait">
                    {currentHighlight === index && (
                      <motion.p
                        key={`description-${index}`}
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-xs text-gray-300 mt-2 overflow-hidden"
                      >
                        {highlight.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>

            {/* 전문 분야 */}
            <motion.div variants={itemVariants} className="mb-8">
              <h3 className="text-lg font-semibold text-gray-300 mb-3">전문 분야</h3>
              <div className="flex flex-wrap gap-2">
                {headerContent.introduction.specialties.map((specialty, index) => (
                  <motion.span
                    key={specialty}
                    custom={index}
                    variants={skillChipVariants}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-500/30 rounded-full text-sm text-gray-200"
                  >
                    {specialty}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* 주요 툴 */}
            <motion.div variants={itemVariants} className="mb-8">
              <h3 className="text-lg font-semibold text-gray-300 mb-3">전문 도구</h3>
              <div className="grid grid-cols-3 gap-2">
                {headerContent.skills.primary.map((skill, index) => (
                  <motion.div
                    key={skill}
                    custom={index}
                    variants={skillChipVariants}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="px-3 py-2 bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/40 rounded-lg text-center text-sm text-gray-200 cursor-pointer transition-all"
                  >
                    {skill}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 연락처 */}
            <motion.div variants={itemVariants} className="text-center">
              <p className="text-gray-400 mb-2">프로젝트 문의</p>
              <a 
                href={`mailto:${headerContent.contact.email}`}
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {headerContent.contact.email}
              </a>
            </motion.div>
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default HeaderTextDisplay;