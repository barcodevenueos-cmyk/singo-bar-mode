import React from 'react';
import { motion } from 'framer-motion';

export const CyberButton = ({ children, onClick, variant = 'default', className = '', disabled = false, testId, ...props }) => {
  const baseStyles = 'font-primary uppercase tracking-wider px-6 py-3 border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';
  
  const variants = {
    default: 'bg-dark-surface text-white border-neon-purple shadow-neon-purple hover:shadow-neon-cyan hover:border-neon-cyan',
    primary: 'bg-gradient-to-r from-neon-pink to-neon-purple text-white border-neon-pink shadow-neon-pink hover:shadow-neon-cyan px-8 py-4 text-xl font-bold',
    secondary: 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white border-neon-cyan shadow-neon-cyan hover:shadow-neon-purple',
    ghost: 'bg-transparent text-neon-cyan border-neon-cyan hover:bg-neon-cyan/10 hover:shadow-neon-cyan'
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};