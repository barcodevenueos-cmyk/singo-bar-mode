import React from 'react';
import { NeoCard } from './ui/NeoCard';
import { motion } from 'framer-motion';

const PatternSelector = ({ selectedPattern, onSelectPattern }) => {
  const patterns = [
    { id: 'any', name: 'Any Pattern', icon: '🎯' },
    { id: 'line', name: 'Line', icon: '➖' },
    { id: 'diagonal', name: 'Diagonal', icon: '🔀' },
    { id: 'four_corners', name: 'Four Corners', icon: '⬜' },
    { id: 'x', name: 'X Pattern', icon: '❌' },
    { id: 'full_house', name: 'Full House', icon: '🏠' }
  ];
  
  return (
    <div className="mb-6">
      <h3 className="font-primary text-xl uppercase mb-3" data-testid="pattern-selector-title">
        Win Pattern
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {patterns.map((pattern) => (
          <motion.button
            key={pattern.id}
            data-testid={`pattern-${pattern.id}`}
            onClick={() => onSelectPattern(pattern.id)}
            className={`
              p-4 border-2 border-black font-secondary font-medium text-sm transition-all
              ${selectedPattern === pattern.id 
                ? 'bg-pride-yellow shadow-hard-md' 
                : 'bg-white shadow-hard-sm hover:translate-y-[-2px] hover:shadow-hard-md'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-2xl mb-1">{pattern.icon}</div>
            <div>{pattern.name}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default PatternSelector;