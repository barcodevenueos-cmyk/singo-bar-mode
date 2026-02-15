import React from 'react';
import { motion } from 'framer-motion';

const CalledNumbersBoard = ({ calledNumbers, currentNumber, cyberpunk = false }) => {
  const columns = ['B', 'I', 'N', 'G', 'O'];
  const ranges = [
    { min: 1, max: 15 },
    { min: 16, max: 30 },
    { min: 31, max: 45 },
    { min: 46, max: 60 },
    { min: 61, max: 75 }
  ];
  
  return (
    <div className={`${cyberpunk ? 'bg-dark-card border-2 border-neon-purple shadow-neon-purple backdrop-blur-sm bg-opacity-80 rounded-lg' : 'bg-white border-2 border-black shadow-hard-lg'} p-4`}>
      <h3 className={`font-primary text-2xl uppercase mb-4 text-center ${cyberpunk ? 'text-neon-cyan' : ''}`} data-testid="called-numbers-title">
        Called Numbers
      </h3>
      
      {currentNumber && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className={`mb-6 p-6 border-2 text-center ${
            cyberpunk 
              ? 'bg-gradient-to-r from-neon-pink to-neon-purple border-neon-pink shadow-neon-pink rounded-lg' 
              : 'bg-pride-yellow border-black shadow-hard-md'
          }`}
          data-testid="current-number-display"
        >
          <div className={`font-primary text-6xl md:text-8xl ${cyberpunk ? 'text-white' : 'text-black'}`}>{currentNumber}</div>
        </motion.div>
      )}
      
      <div className="grid grid-cols-5 gap-2">
        {columns.map((letter, colIdx) => (
          <div key={colIdx} className="space-y-1">
            <div className={`text-center font-primary text-xl py-1 border-2 ${
              cyberpunk 
                ? 'bg-gradient-to-r from-neon-purple to-neon-cyan border-neon-cyan text-white rounded' 
                : 'bg-pride-yellow border-black'
            }`}>
              {letter}
            </div>
            <div className="space-y-1">
              {Array.from({ length: 15 }, (_, i) => {
                const num = ranges[colIdx].min + i;
                const isCalled = calledNumbers.includes(num);
                const isLatest = num === currentNumber;
                
                return (
                  <motion.div
                    key={num}
                    data-testid={`board-num-${num}`}
                    className={`
                      text-center text-xs md:text-sm font-mono font-bold py-1 border
                      ${cyberpunk
                        ? `border-neon-purple rounded ${isCalled ? 'bg-gradient-to-br from-neon-pink to-neon-purple text-white shadow-neon-pink' : 'bg-dark-surface text-gray-600'}`
                        : `border-black ${isCalled ? 'bg-pride-pink text-white' : 'bg-white text-gray-300'}`
                      }
                      ${isLatest ? (cyberpunk ? 'ring-2 ring-neon-cyan' : 'ring-2 ring-pride-purple') : ''}
                    `}
                    animate={isLatest ? { scale: [1, 1.2, 1] } : {}}
                  >
                    {num}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className={`mt-4 text-center font-secondary ${cyberpunk ? 'text-white' : ''}`}>
        <span className="font-bold">{calledNumbers.length}</span> / 75 called
      </div>
    </div>
  );
};

export default CalledNumbersBoard;