import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { playSound } from '../utils/sounds';

const BingoCard = ({ card, calledNumbers, onDaub, autoDaub, soundEnabled = true, cyberpunk = false }) => {
  const columns = ['B', 'I', 'N', 'G', 'O'];
  
  const handleCellClick = (row, col) => {
    if (card.daubed[row][col]) return;
    
    const number = card.numbers[row][col];
    if (number === 0 || calledNumbers.includes(number)) {
      if (soundEnabled) playSound('daub');
      onDaub(row, col);
    }
  };
  
  React.useEffect(() => {
    if (autoDaub) {
      card.numbers.forEach((row, rowIdx) => {
        row.forEach((num, colIdx) => {
          if (num !== 0 && calledNumbers.includes(num) && !card.daubed[rowIdx][colIdx]) {
            onDaub(rowIdx, colIdx);
          }
        });
      });
    }
  }, [calledNumbers, autoDaub]);
  
  return (
    <div className={`${cyberpunk ? 'bg-dark-card border-2 border-neon-purple shadow-neon-purple backdrop-blur-sm bg-opacity-80 rounded-lg' : 'bg-white border-2 border-black shadow-hard-lg'} p-4`}>
      <div className="grid grid-cols-5 gap-1 mb-2">
        {columns.map((letter, idx) => (
          <div
            key={idx}
            className={`text-center font-primary text-2xl md:text-3xl py-2 border-2 ${
              cyberpunk 
                ? 'bg-gradient-to-r from-neon-pink to-neon-purple border-neon-pink text-white shadow-neon-pink rounded' 
                : 'bg-pride-yellow border-black'
            }`}
            data-testid={`bingo-letter-${letter}`}
          >
            {letter}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-5 gap-1">
        {card.numbers.map((row, rowIdx) =>
          row.map((num, colIdx) => {
            const isDaubed = card.daubed[rowIdx][colIdx];
            const isFree = num === 0;
            const isCalled = calledNumbers.includes(num);
            
            return (
              <motion.div
                key={`${rowIdx}-${colIdx}`}
                data-testid={`cell-${rowIdx}-${colIdx}`}
                onClick={() => handleCellClick(rowIdx, colIdx)}
                className={`
                  aspect-square flex items-center justify-center border-2
                  text-xl md:text-2xl font-mono font-bold cursor-pointer transition-all relative select-none
                  ${cyberpunk 
                    ? `border-neon-purple ${isDaubed ? 'bg-gradient-to-br from-neon-pink to-neon-purple text-white shadow-neon-pink animate-pulse' : isCalled ? 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan shadow-neon-cyan' : 'bg-dark-surface text-white hover:bg-dark-card hover:shadow-neon-cyan'} rounded`
                    : `border-black ${isDaubed ? 'bg-pride-pink text-white' : isCalled ? 'bg-pride-yellow text-black' : 'bg-white text-black hover:bg-gray-100'}`
                  }
                `}
                animate={isDaubed ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {isFree ? (
                  <span className="text-base md:text-lg">FREE</span>
                ) : (
                  <span>{num}</span>
                )}
                {isDaubed && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Check className="w-6 h-6 md:w-8 md:h-8 text-white" strokeWidth={3} />
                  </motion.div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BingoCard;