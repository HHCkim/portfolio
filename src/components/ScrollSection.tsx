import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface ScrollSectionProps {
  title: string;
  description: string;
  isActive: boolean;
}

// 컨테이너 애니메이션 variants 정의
const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // 각 단어가 0.05초 간격으로 순차적으로 나타남
      delayChildren: 0.1,
    },
  },
};

// 개별 단어 애니메이션 variants 정의
const wordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
};

const ScrollSection = forwardRef<HTMLElement, ScrollSectionProps>(
  ({ title, description, isActive }, ref) => {
    // 텍스트를 단어 단위로 분할
    const titleWords = title.split(' ');
    const descriptionWords = description.split(' ');

    return (
      <section
        ref={ref}
        className="h-screen px-16 flex items-center justify-center"
        style={{ scrollSnapAlign: 'start' }}
      >
        <motion.div
          className={`transform transition-all duration-700 ${
            isActive
              ? 'opacity-100 translate-y-0'
              : 'opacity-30 translate-y-8'
          }`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={containerVariants}
        >
          <motion.h2 className="text-4xl font-extrabold mb-6 text-gray-100">
            {titleWords.map((word, index) => (
              <motion.span
                key={index}
                variants={wordVariants}
                className="inline-block mr-2"
              >
                {word}
              </motion.span>
            ))}
          </motion.h2>
          <motion.p className="text-lg leading-relaxed text-gray-300 max-w-xl">
            {descriptionWords.map((word, index) => (
              <motion.span
                key={index}
                variants={wordVariants}
                className="inline-block mr-1"
              >
                {word}
              </motion.span>
            ))}
          </motion.p>
        </motion.div>
      </section>
    );
  }
);

ScrollSection.displayName = 'ScrollSection';

export default ScrollSection;