import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { CyberButton } from '../components/ui/CyberButton';
import { CyberInput } from '../components/ui/CyberInput';
import { CyberCard } from '../components/ui/CyberCard';
import BingoCard from '../components/BingoCard';
import CalledNumbersBoard from '../components/CalledNumbersBoard';
import MusicalNotes from '../components/MusicalNotes';
import { ArrowLeft, Play, Pause, Users, Crown } from 'lucide-react';
import { playSound } from '../utils/sounds';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BarModePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const viewMode = searchParams.get('view') || 'setup';
  
  const [setupComplete, setSetupComplete] = useState(false);
  const [role, setRole] = useState('player');
  const [playerName, setPlayerName] = useState('');
  const [gameData, setGameData] = useState(null);
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(null);
  const [autoDaub, setAutoDaub] = useState(true);
  const [autoCall, setAutoCall] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [ws, setWs] = useState(null);
  
  useEffect(() => {
    return () => {
      if (ws) ws.close();
    };
  }, [ws]);
  
  useEffect(() => {
    let interval;
    if (autoCall && setupComplete && role === 'admin' && !gameWon) {
      interval = setInterval(() => {
        callNextNumber();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [autoCall, setupComplete, role, gameWon]);
  
  const startBarMode = async () => {
    if (!playerName.trim()) {
      alert('Please enter player name');
      return;
    }
    
    if (soundEnabled) playSound('click');
    
    try {
      const response = await axios.post(`${API}/game/create`, null, {
        params: {
          mode: 'bar',
          player_name: playerName,
          num_cards: 1,
          pattern: 'any'
        }
      });
      
      setGameData(response.data);
      setSetupComplete(true);
      
      await axios.post(`${API}/game/${response.data.game_id}/start`);
      
      const wsUrl = `${BACKEND_URL.replace('https://', 'wss://').replace('http://', 'ws://')}/api/ws/${response.data.game_id}/${response.data.player_id}`;
      const websocket = new WebSocket(wsUrl);
      
      websocket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'number_called') {
          setCalledNumbers(message.called_numbers);
          setCurrentNumber(message.number);
          if (soundEnabled) playSound('numberCall');
        } else if (message.type === 'game_won') {
          handleWin();
        }
      };
      
      setWs(websocket);
    } catch (error) {
      console.error('Error starting bar mode:', error);
      alert('Failed to start bar mode');
    }
  };
  
  const callNextNumber = async () => {
    if (!gameData || gameWon) return;
    
    try {
      const response = await axios.post(`${API}/game/${gameData.game_id}/call-number`);
      if (response.data.number) {
        setCurrentNumber(response.data.number);
        setCalledNumbers(response.data.called_numbers);
        if (soundEnabled) playSound('numberCall');
      } else if (response.data.game_over) {
        setAutoCall(false);
      }
    } catch (error) {
      console.error('Error calling number:', error);
    }
  };
  
  const handleDaub = async (row, col) => {
    if (!gameData || gameWon) return;
    
    const updatedCards = [...gameData.cards];
    updatedCards[0].daubed[row][col] = true;
    setGameData({ ...gameData, cards: updatedCards });
    
    try {
      const response = await axios.post(`${API}/game/${gameData.game_id}/daub`, null, {
        params: {
          player_id: gameData.player_id,
          card_id: gameData.cards[0].card_id,
          row,
          col
        }
      });
      
      if (response.data.winner) {
        handleWin();
      }
    } catch (error) {
      console.error('Error daubing:', error);
    }
  };
  
  const handleWin = () => {
    setGameWon(true);
    setAutoCall(false);
    
    if (soundEnabled) playSound('win');
    
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#FF10F0', '#9D00FF', '#00F0FF', '#C0C0C0']
    });
  };
  
  if (!setupComplete) {
    return (
      <div className="min-h-screen bg-dark-bg cyberpunk-bg p-4 md:p-8 relative">
        <MusicalNotes />
        <div className="max-w-2xl mx-auto relative z-10">
          <CyberButton
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-8"
            testId="back-to-home-btn"
          >
            <ArrowLeft className="w-5 h-5 inline mr-2" />
            Back to Home
          </CyberButton>
          
          <CyberCard neonColor="pink">
            <h1 className="font-primary text-4xl md:text-6xl uppercase tracking-wider text-center mb-8 text-neon text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan">
              BAR MODE
            </h1>
            
            <div className="space-y-6">
              <div>
                <label className="font-mono text-xs uppercase tracking-widest text-neon-cyan block mb-2">
                  Select Role
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setRole('player')}
                    data-testid="role-player-btn"
                    className={`p-6 border-2 transition-all font-primary uppercase tracking-wider rounded-lg ${
                      role === 'player'
                        ? 'bg-gradient-to-r from-neon-pink to-neon-purple border-neon-pink shadow-neon-pink'
                        : 'bg-dark-surface border-neon-purple hover:border-neon-cyan'
                    }`}
                  >
                    <Users className="w-8 h-8 mx-auto mb-2" />
                    Player View
                  </button>
                  <button
                    onClick={() => setRole('admin')}
                    data-testid="role-admin-btn"
                    className={`p-6 border-2 transition-all font-primary uppercase tracking-wider rounded-lg ${
                      role === 'admin'
                        ? 'bg-gradient-to-r from-neon-purple to-neon-cyan border-neon-cyan shadow-neon-cyan'
                        : 'bg-dark-surface border-neon-purple hover:border-neon-cyan'
                    }`}
                  >
                    <Crown className="w-8 h-8 mx-auto mb-2" />
                    Admin View
                  </button>
                </div>
              </div>
              
              <div>
                <label className="font-mono text-xs uppercase tracking-widest text-neon-cyan block mb-2">
                  Player Name
                </label>
                <CyberInput
                  placeholder="Enter player name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  testId="bar-player-name-input"
                />
              </div>
              
              <CyberButton
                variant="primary"
                onClick={startBarMode}
                className="w-full"
                testId="start-bar-mode-btn"
              >
                Start Bar Mode
              </CyberButton>
            </div>
          </CyberCard>
        </div>
      </div>
    );
  }
  
  // Player View - Only Bingo Card
  if (role === 'player') {
    return (
      <div className="min-h-screen bg-dark-bg cyberpunk-bg flex items-center justify-center p-4 relative">
        <MusicalNotes />
        <div className="relative z-10 w-full max-w-2xl">
          {gameWon && (
            <div className="mb-8 text-center">
              <h2 className="font-primary text-6xl uppercase text-neon-pink animate-glow-pulse" data-testid="player-win-message">
                BINGO! YOU WIN!
              </h2>
            </div>
          )}
          
          {gameData && gameData.cards && gameData.cards[0] && (
            <BingoCard
              card={gameData.cards[0]}
              calledNumbers={calledNumbers}
              onDaub={handleDaub}
              autoDaub={autoDaub}
              soundEnabled={soundEnabled}
              cyberpunk={true}
            />
          )}
        </div>
      </div>
    );
  }
  
  // Admin View - Only Called Numbers and Controls
  return (
    <div className="min-h-screen bg-dark-bg cyberpunk-bg p-4 relative">
      <MusicalNotes />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-primary text-3xl md:text-5xl uppercase tracking-wider text-neon-pink">
            Admin Control
          </h1>
          <CyberButton
            variant="ghost"
            onClick={() => {
              setSetupComplete(false);
              if (ws) ws.close();
            }}
            testId="admin-exit-btn"
          >
            Exit
          </CyberButton>
        </div>
        
        <div className="mb-6 flex flex-wrap gap-4">
          <CyberButton
            variant={autoCall ? 'secondary' : 'default'}
            onClick={() => setAutoCall(!autoCall)}
            disabled={gameWon}
            testId="admin-auto-call-btn"
          >
            {autoCall ? <Pause className="w-5 h-5 inline mr-2" /> : <Play className="w-5 h-5 inline mr-2" />}
            Auto Call: {autoCall ? 'ON' : 'OFF'}
          </CyberButton>
          
          <CyberButton
            variant="primary"
            onClick={callNextNumber}
            disabled={autoCall || gameWon}
            testId="admin-call-number-btn"
          >
            Call Next Number
          </CyberButton>
        </div>
        
        <CalledNumbersBoard
          calledNumbers={calledNumbers}
          currentNumber={currentNumber}
          cyberpunk={true}
        />
      </div>
    </div>
  );
};

export default BarModePage;
