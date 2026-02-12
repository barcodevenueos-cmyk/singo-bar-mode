import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NeoButton } from '../components/ui/NeoButton';
import { NeoCard } from '../components/ui/NeoCard';
import { Users, User } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  
  const prideColors = ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF', '#AF52DE'];
  
  return (
    <div className="min-h-screen bg-cream p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12 mt-8"
        >
          <div className="inline-block mb-6">
            <div className="rainbow-border">
              <div className="rainbow-border-content px-8 py-4">
                <h1 className="font-primary text-5xl md:text-7xl uppercase tracking-tighter leading-[0.9] text-black">
                  PRIDE BINGO
                </h1>
              </div>
            </div>
          </div>
          <p className="font-secondary text-lg md:text-xl font-medium max-w-2xl mx-auto text-black">
            Celebrate diversity and inclusion with our vibrant bingo game. Play solo or join friends for an unforgettable experience!
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <NeoCard interactive onClick={() => navigate('/single-player')} testId="single-player-card">
              <div className="text-center space-y-4">
                <div className="mx-auto w-20 h-20 bg-pride-yellow border-2 border-black shadow-hard-md flex items-center justify-center">
                  <User className="w-10 h-10 text-black" />
                </div>
                <h2 className="font-primary text-3xl uppercase tracking-tight">Single Player</h2>
                <p className="font-secondary text-base leading-relaxed">
                  Play at your own pace with auto-calling numbers. Perfect for practicing or relaxing solo play.
                </p>
                <NeoButton variant="primary" className="w-full" testId="play-single-btn">
                  Play Solo
                </NeoButton>
              </div>
            </NeoCard>
          </motion.div>
          
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <NeoCard interactive onClick={() => navigate('/multiplayer')} testId="multiplayer-card">
              <div className="text-center space-y-4">
                <div className="mx-auto w-20 h-20 bg-pride-cyan border-2 border-black shadow-hard-md flex items-center justify-center">
                  <Users className="w-10 h-10 text-black" />
                </div>
                <h2 className="font-primary text-3xl uppercase tracking-tight">Multiplayer</h2>
                <p className="font-secondary text-base leading-relaxed">
                  Join or create rooms and compete with friends. First to BINGO wins!
                </p>
                <NeoButton variant="secondary" className="w-full" testId="play-multiplayer-btn">
                  Play Together
                </NeoButton>
              </div>
            </NeoCard>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="flex flex-wrap justify-center gap-2">
            {prideColors.map((color, idx) => (
              <motion.div
                key={idx}
                className="w-12 h-12 border-2 border-black shadow-hard-sm"
                style={{ backgroundColor: color }}
                whileHover={{ scale: 1.1, rotate: 180 }}
                transition={{ type: 'spring', stiffness: 300 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;