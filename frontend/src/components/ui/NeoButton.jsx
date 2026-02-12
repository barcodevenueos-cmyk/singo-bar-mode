import React from 'react';
import { motion } from 'framer-motion';

export const NeoButton = ({ children, onClick, variant = 'default', className = '', disabled = false, testId, ...props }) => {
  const baseStyles = 'font-primary uppercase tracking-wider px-6 py-3 border-2 border-black transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    default: 'bg-white text-black shadow-hard-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-hard-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
    primary: 'bg-pride-yellow text-black shadow-hard-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-hard-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none px-8 py-4 text-xl',
    secondary: 'bg-pride-cyan text-black shadow-hard-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-hard-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
    ghost: 'bg-transparent text-black border-transparent hover:bg-black/5 font-bold text-sm'
  };
  
  return (
    <motion.button
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