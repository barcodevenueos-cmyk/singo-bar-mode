import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CyberButton } from '../components/ui/CyberButton';
import { CyberCard } from '../components/ui/CyberCard';
import MusicalNotes from '../components/MusicalNotes';
import { ArrowLeft, Trophy, Star, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadLeaderboard();
  }, []);
  
  const loadLeaderboard = async () => {
    try {
      const response = await axios.get(`${API}/leaderboard?limit=20`);
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getMedalColor = (index) => {
    if (index === 0) return 'bg-gradient-to-r from-neon-pink to-neon-purple';
    if (index === 1) return 'bg-gradient-to-r from-neon-cyan to-neon-blue';
    if (index === 2) return 'bg-gradient-to-r from-neon-purple to-neon-pink';
    return 'bg-dark-surface';
  };
  
  const getMedalIcon = (index) => {
    if (index === 0) return <Trophy className="w-8 h-8 text-neon-pink" />;
    if (index === 1) return <Star className="w-7 h-7 text-neon-cyan" />;
    if (index === 2) return <Target className="w-6 h-6 text-neon-purple" />;
    return <span className="font-primary text-xl text-white">{index + 1}</span>;
  };
  
  return (
    <div className="min-h-screen bg-dark-bg cyberpunk-bg p-4 md:p-8 relative">
      <MusicalNotes />
      <div className="max-w-4xl mx-auto relative z-10">
        <CyberButton
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-8"
          testId="back-to-home-btn"
        >
          <ArrowLeft className="w-5 h-5 inline mr-2" />
          Back to Home
        </CyberButton>
        
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="inline-block mb-4">
            <div className="gradient-border rounded-lg">
              <div className="gradient-border-content px-8 py-4 rounded-lg">
                <h1 className="font-primary text-5xl md:text-6xl uppercase tracking-wider font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan">
                  LEADERBOARD
                </h1>
              </div>
            </div>
          </div>
          <p className="font-secondary text-lg text-gray-300">Top Players - Who's Got the Crown?</p>
        </motion.div>
        
        <CyberCard neonColor="purple">{}
          {loading ? (
            <div className="text-center py-12 font-secondary text-lg text-white">Loading leaderboard...</div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12 font-secondary text-lg text-white">
              No players yet. Be the first to win!
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-4 pb-3 border-b-2 border-neon-purple font-mono text-xs uppercase tracking-widest font-bold text-neon-cyan">
                <div className="col-span-1">Rank</div>
                <div className="col-span-5">Player</div>
                <div className="col-span-2 text-center">Wins</div>
                <div className="col-span-2 text-center">Games</div>
                <div className="col-span-2 text-center">Win %</div>
              </div>
              
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={entry.player_name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  data-testid={`leaderboard-entry-${index}`}
                  className={`
                    grid grid-cols-12 gap-4 p-4 border-2 rounded-lg
                    ${getMedalColor(index)} ${index < 3 ? 'border-neon-pink shadow-neon-pink' : 'border-neon-purple'} text-white
                  `}
                >
                  <div className="col-span-1 flex items-center justify-center">
                    {getMedalIcon(index)}
                  </div>
                  <div className="col-span-5 flex items-center font-secondary font-bold text-lg">
                    {entry.player_name}
                  </div>
                  <div className="col-span-2 flex items-center justify-center font-mono font-bold text-xl">
                    {entry.wins}
                  </div>
                  <div className="col-span-2 flex items-center justify-center font-mono">
                    {entry.games_played}
                  </div>
                  <div className="col-span-2 flex items-center justify-center font-mono font-bold">
                    {entry.win_rate}%
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CyberCard>
        
        <div className="mt-8 text-center">
          <CyberButton
            variant="primary"
            onClick={() => navigate('/')}
            testId="play-now-btn"
          >
            Play Now
          </CyberButton>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;