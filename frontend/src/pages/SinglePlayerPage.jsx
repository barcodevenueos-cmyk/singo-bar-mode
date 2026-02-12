import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { NeoButton } from '../components/ui/NeoButton';
import { NeoInput } from '../components/ui/NeoInput';
import { NeoCard } from '../components/ui/NeoCard';
import BingoCard from '../components/BingoCard';
import CalledNumbersBoard from '../components/CalledNumbersBoard';
import PatternSelector from '../components/PatternSelector';
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { playSound } from '../utils/sounds';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SinglePlayerPage = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [numCards, setNumCards] = useState(1);
  const [selectedPattern, setSelectedPattern] = useState('any');
  const [gameStarted, setGameStarted] = useState(false);
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
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);
  
  useEffect(() => {
    let interval;
    if (autoCall && gameStarted && !gameWon) {
      interval = setInterval(() => {
        callNextNumber();
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [autoCall, gameStarted, gameWon]);
  
  const startGame = async () => {
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    if (soundEnabled) playSound('click');
    
    try {
      const response = await axios.post(`${API}/game/create`, null, {
        params: {
          mode: 'single',
          player_name: playerName,
          num_cards: numCards,
          pattern: selectedPattern
        }
      });
      
      setGameData(response.data);
      setGameStarted(true);
      
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
      console.error('Error starting game:', error);
      alert('Failed to start game');
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
  
  const handleDaub = async (cardIndex, row, col) => {
    if (!gameData || gameWon) return;
    
    const updatedCards = [...gameData.cards];
    updatedCards[cardIndex].daubed[row][col] = true;
    setGameData({ ...gameData, cards: updatedCards });
    
    try {
      const response = await axios.post(`${API}/game/${gameData.game_id}/daub`, null, {
        params: {
          player_id: gameData.player_id,
          card_id: gameData.cards[cardIndex].card_id,
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
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF', '#AF52DE', '#FF2D55']
    });
    
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF', '#AF52DE', '#FF2D55']
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF', '#AF52DE', '#FF2D55']
      });
    }, 250);
  };
  
  const resetGame = () => {
    if (ws) {
      ws.close();
    }
    setGameStarted(false);
    setGameData(null);
    setCalledNumbers([]);
    setCurrentNumber(null);
    setAutoCall(false);
    setGameWon(false);
  };
  
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-cream p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <NeoButton
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-8"
            testId="back-to-home-btn"
          >
            <ArrowLeft className="w-5 h-5 inline mr-2" />
            Back to Home
          </NeoButton>
          
          <NeoCard>
            <h1 className="font-primary text-4xl uppercase tracking-tight mb-6 text-center">
              Single Player Setup
            </h1>
            
            <div className="space-y-6">
              <div>
                <label className="font-mono text-xs uppercase tracking-widest font-bold block mb-2">
                  Your Name
                </label>
                <NeoInput
                  placeholder="Enter your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  testId="player-name-input"
                />
              </div>
              
              <div>
                <label className="font-mono text-xs uppercase tracking-widest font-bold block mb-2">
                  Number of Cards (1-4)
                </label>
                <NeoInput
                  type="number"
                  min="1"
                  max="4"
                  value={numCards}
                  onChange={(e) => setNumCards(Math.min(4, Math.max(1, parseInt(e.target.value) || 1)))}
                  testId="num-cards-input"
                />
              </div>
              
              <NeoButton
                variant="primary"
                onClick={startGame}
                className="w-full"
                testId="start-game-btn"
              >
                Start Game
              </NeoButton>
            </div>
          </NeoCard>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-cream p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-primary text-3xl md:text-5xl uppercase tracking-tight">
              {playerName}'s Game
            </h1>
            {gameWon && (
              <div className="font-primary text-2xl md:text-4xl text-pride-pink mt-2" data-testid="winner-message">
                🎉 BINGO! YOU WON! 🎉
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <NeoButton
              variant="ghost"
              onClick={() => navigate('/')}
              testId="leave-game-btn"
            >
              <ArrowLeft className="w-5 h-5 inline mr-2" />
              Leave
            </NeoButton>
            <NeoButton
              variant="default"
              onClick={resetGame}
              testId="reset-game-btn"
            >
              <RotateCcw className="w-5 h-5 inline mr-2" />
              New Game
            </NeoButton>
          </div>
        </div>
        
        <div className="mb-6 flex flex-wrap gap-4">
          <NeoButton
            variant={autoCall ? 'secondary' : 'default'}
            onClick={() => setAutoCall(!autoCall)}
            disabled={gameWon}
            testId="auto-call-toggle-btn"
          >
            {autoCall ? <Pause className="w-5 h-5 inline mr-2" /> : <Play className="w-5 h-5 inline mr-2" />}
            Auto Call: {autoCall ? 'ON' : 'OFF'}
          </NeoButton>
          
          <NeoButton
            variant="default"
            onClick={callNextNumber}
            disabled={autoCall || gameWon}
            testId="manual-call-btn"
          >
            Call Next Number
          </NeoButton>
          
          <label className="flex items-center gap-2 font-secondary font-medium">
            <input
              type="checkbox"
              checked={autoDaub}
              onChange={(e) => setAutoDaub(e.target.checked)}
              className="w-5 h-5"
              data-testid="auto-daub-checkbox"
            />
            Auto-Daub
          </label>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className={`grid ${numCards > 1 ? 'md:grid-cols-2' : 'max-w-md mx-auto'} gap-6`}>
              {gameData.cards.map((card, idx) => (
                <BingoCard
                  key={card.card_id}
                  card={card}
                  calledNumbers={calledNumbers}
                  onDaub={(row, col) => handleDaub(idx, row, col)}
                  autoDaub={autoDaub}
                />
              ))}
            </div>
          </div>
          
          <div>
            <CalledNumbersBoard
              calledNumbers={calledNumbers}
              currentNumber={currentNumber}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePlayerPage;