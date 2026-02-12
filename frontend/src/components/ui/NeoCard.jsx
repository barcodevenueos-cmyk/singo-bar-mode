import React from 'react';
import { motion } from 'framer-motion';

export const NeoCard = ({ children, interactive = false, className = '', onClick, testId }) => {
  const baseStyles = 'bg-white border-2 border-black shadow-hard-lg p-6 relative overflow-visible';
  const interactiveStyles = interactive ? 'hover:translate-y-[-4px] hover:shadow-hard-xl transition-all cursor-pointer' : '';
  
  const Component = interactive ? motion.div : 'div';
  const motionProps = interactive ? {
    whileHover: { y: -4 },
    whileTap: { scale: 0.98 }
  } : {};
  
  return (
    <Component
      onClick={onClick}
      data-testid={testId}
      className={`${baseStyles} ${interactiveStyles} ${className}`}
      {...motionProps}
    >
      {children}
    </Component>
  );
};