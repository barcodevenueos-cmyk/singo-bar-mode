import React from 'react';

export const CyberInput = ({ placeholder, value, onChange, className = '', testId, ...props }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      data-testid={testId}
      className={`bg-dark-surface border-2 border-neon-purple p-4 font-secondary text-lg outline-none focus:border-neon-pink focus:shadow-neon-pink placeholder:text-gray-500 transition-all text-white rounded-lg ${className}`}
      {...props}
    />
  );
};