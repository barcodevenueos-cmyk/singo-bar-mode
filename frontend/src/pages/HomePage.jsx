import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CyberButton } from '../components/ui/CyberButton';
import { CyberCard } from '../components/ui/CyberCard';
import MusicalNotes from '../components/MusicalNotes';
import { Users, User, Trophy, Music } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-dark-bg cyberpunk-bg p-4 md:p-8 relative">
      <MusicalNotes />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12 mt-8"
        >
          <div className="inline-block mb-6">
            <div className="gradient-border rounded-lg">
              <div className="gradient-border-content px-8 py-6 rounded-lg">
                <h1 className="font-primary text-6xl md:text-8xl uppercase tracking-wider font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan">
                  SINGO
                </h1>
              </div>
            </div>
          </div>
          <p className="font-secondary text-lg md:text-xl font-normal max-w-2xl mx-auto text-gray-300 mb-6">
            The ultimate bingo experience
          </p>
          <div className="flex justify-center gap-4">
            <CyberButton
              variant="ghost"
              onClick={() => navigate('/leaderboard')}
              testId="view-leaderboard-btn"
            >
              <Trophy className="w-5 h-5 inline mr-2" />
              Leaderboard
            </CyberButton>
          </div>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg border-2 border-neon-pink">
              <div className="text-center">
                <div className="font-primary text-3xl uppercase tracking-wider text-neon-pink mb-2">
                  Coming Soon
                </div>
                <div className="font-secondary text-sm text-gray-300">
                  Available in next update
                </div>
              </div>
            </div>
            <CyberCard interactive={false} testId="single-player-card" neonColor="pink" className="opacity-50">
              <div className="text-center space-y-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-neon-pink to-neon-purple rounded-lg shadow-neon-pink flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h2 className="font-primary text-2xl uppercase tracking-tight text-neon-pink">Single Player</h2>
                <p className="font-secondary text-base leading-relaxed text-gray-300">
                  Play at your own pace with auto-calling numbers and pattern challenges.
                </p>
              </div>
            </CyberCard>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <CyberCard interactive onClick={() => navigate('/bar-mode')} testId="bar-mode-card" neonColor="purple">
              <div className="text-center space-y-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-neon-purple to-neon-cyan rounded-lg shadow-neon-purple flex items-center justify-center">
                  <Music className="w-10 h-10 text-white" />
                </div>
                <h2 className="font-primary text-2xl uppercase tracking-tight text-neon-purple">Bar Mode</h2>
                <p className="font-secondary text-base leading-relaxed text-gray-300">
                  Split view mode perfect for bars. Player sees card, admin controls calls.
                </p>
                <CyberButton variant="secondary" className="w-full" testId="play-bar-btn">
                  Bar Mode
                </CyberButton>
              </div>
            </CyberCard>
          </motion.div>
          
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg border-2 border-neon-cyan">
              <div className="text-center">
                <div className="font-primary text-3xl uppercase tracking-wider text-neon-cyan mb-2">
                  Coming Soon
                </div>
                <div className="font-secondary text-sm text-gray-300">
                  Available in next update
                </div>
              </div>
            </div>
            <CyberCard interactive={false} testId="multiplayer-card" neonColor="cyan" className="opacity-50">
              <div className="text-center space-y-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-neon-cyan to-neon-blue rounded-lg shadow-neon-cyan flex items-center justify-center">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h2 className="font-primary text-2xl uppercase tracking-tight text-neon-cyan">Multiplayer</h2>
                <p className="font-secondary text-base leading-relaxed text-gray-300">
                  Join or create rooms and compete with friends. First to BINGO wins!
                </p>
              </div>
            </CyberCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;