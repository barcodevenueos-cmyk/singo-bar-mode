import React from 'react';
import { motion } from 'framer-motion';

export const CyberCard = ({ children, interactive = false, className = '', onClick, testId, neonColor = 'purple' }) => {
  const shadowColors = {
    purple: 'shadow-neon-purple',
    pink: 'shadow-neon-pink',
    cyan: 'shadow-neon-cyan'
  };
  
  const baseStyles = `bg-dark-card border-2 border-neon-${neonColor} ${shadowColors[neonColor]} p-6 backdrop-blur-sm bg-opacity-80 rounded-lg`;
  const interactiveStyles = interactive ? `hover:shadow-neon-cyan hover:scale-105 transition-all cursor-pointer` : '';
  
  const Component = interactive ? motion.div : 'div';
  const motionProps = interactive ? {
    whileHover: { scale: 1.05 },
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