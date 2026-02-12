import React from 'react';

export const NeoInput = ({ placeholder, value, onChange, className = '', testId, ...props }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      data-testid={testId}
      className={`bg-white border-2 border-black p-4 font-secondary text-lg outline-none focus:ring-4 focus:ring-pride-purple/30 placeholder:text-neutral-500 shadow-hard-md transition-all ${className}`}
      {...props}
    />
  );
};