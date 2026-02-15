import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { CyberButton } from '../components/ui/CyberButton';
import { CyberCard } from '../components/ui/CyberCard';
import MusicalNotes from '../components/MusicalNotes';
import BingoCard from '../components/BingoCard';
import CalledNumbersBoard from '../components/CalledNumbersBoard';
import { ArrowLeft, Play, Users } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const GameRoomPage = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const playerId = searchParams.get('player_id');
  const playerName = searchParams.get('player_name');
  
  const [room, setRoom] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameData, setGameData] = useState(null);
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(null);
  const [autoDaub, setAutoDaub] = useState(true);
  const [gameWon, setGameWon] = useState(false);
  const [winnerName, setWinnerName] = useState(null);
  const [ws, setWs] = useState(null);
  
  useEffect(() => {
    loadRoom();
    const interval = setInterval(loadRoom, 3000);
    return () => {
      clearInterval(interval);
      if (ws) {
        ws.close();
      }
    };
  }, [roomId]);
  
  const loadRoom = async () => {
    try {
      const response = await axios.get(`${API}/room/${roomId}`);
      setRoom(response.data);
    } catch (error) {
      console.error('Error loading room:', error);
    }
  };
  
  const startGame = async () => {
    try {
      const response = await axios.post(`${API}/game/create`, null, {
        params: {
          mode: 'multiplayer',
          player_name: playerName,
          num_cards: 1
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
        } else if (message.type === 'game_won') {
          handleWin(message.winner_id === playerId, message.winner_name);
        }
      };
      
      setWs(websocket);
      
      if (ws) {
        const interval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN && !gameWon) {
            ws.send(JSON.stringify({ type: 'auto_call' }));
          }
        }, 3000);
        
        return () => clearInterval(interval);
      }
    } catch (error) {
      console.error('Error starting game:', error);
      alert('Failed to start game');
    }
  };
  
  const handleDaub = async (row, col) => {
    if (!gameData || gameWon) return;
    
    const updatedCards = [...gameData.cards];
    const currentState = updatedCards[0].daubed[row][col];
    updatedCards[0].daubed[row][col] = !currentState; // Toggle
    setGameData({ ...gameData, cards: updatedCards });
    
    try {
      const response = await axios.post(`${API}/game/${gameData.game_id}/daub`, null, {
        params: {
          player_id: gameData.player_id,
          card_id: gameData.cards[0].card_id,
          row,
          col,
          toggle: true
        }
      });
      
      if (response.data.winner) {
        handleWin(true, playerName);
      }
    } catch (error) {
      console.error('Error daubing:', error);
    }
  };
  
  const handleWin = (isWinner, winnerNameParam) => {
    setGameWon(true);
    setWinnerName(winnerNameParam);
    
    if (isWinner) {
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
    }
  };
  
  if (!room) {
    return (
      <div className="min-h-screen bg-cream p-4 flex items-center justify-center">
        <div className="font-primary text-2xl">Loading room...</div>
      </div>
    );
  }
  
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-cream p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <NeoButton
            variant="ghost"
            onClick={() => navigate('/multiplayer')}
            className="mb-8"
            testId="back-to-lobby-btn"
          >
            <ArrowLeft className="w-5 h-5 inline mr-2" />
            Back to Lobby
          </NeoButton>
          
          <NeoCard>
            <h1 className="font-primary text-3xl md:text-5xl uppercase tracking-tight mb-6 text-center">
              {room.room_name}
            </h1>
            
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-pride-yellow border-2 border-black shadow-hard-md">
                <Users className="w-6 h-6" />
                <span className="font-primary text-2xl">
                  {room.player_ids.length} / {room.max_players} Players
                </span>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="font-primary text-xl uppercase mb-4">Players in Room:</h2>
              <div className="space-y-2">
                {room.player_ids.map((pid, idx) => (
                  <div
                    key={pid}
                    className="bg-white border-2 border-black p-3 shadow-hard-sm"
                    data-testid={`player-${idx}`}
                  >
                    <span className="font-secondary font-medium">
                      Player {idx + 1} {pid === room.host_id && '(Host)'} {pid === playerId && '(You)'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {room.host_id === playerId && (
              <NeoButton
                variant="primary"
                onClick={startGame}
                className="w-full"
                disabled={room.player_ids.length < 2}
                testId="start-multiplayer-game-btn"
              >
                <Play className="w-5 h-5 inline mr-2" />
                Start Game
              </NeoButton>
            )}
            
            {room.host_id !== playerId && (
              <div className="text-center font-secondary text-lg">
                Waiting for host to start the game...
              </div>
            )}
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
              {room.room_name}
            </h1>
            {gameWon && (
              <div className="font-primary text-2xl md:text-4xl text-pride-pink mt-2" data-testid="winner-announcement">
                🎉 {winnerName} WON! 🎉
              </div>
            )}
          </div>
          
          <NeoButton
            variant="ghost"
            onClick={() => navigate('/multiplayer')}
            testId="leave-game-room-btn"
          >
            <ArrowLeft className="w-5 h-5 inline mr-2" />
            Leave Game
          </NeoButton>
        </div>
        
        <div className="mb-6">
          <label className="flex items-center gap-2 font-secondary font-medium">
            <input
              type="checkbox"
              checked={autoDaub}
              onChange={(e) => setAutoDaub(e.target.checked)}
              className="w-5 h-5"
              data-testid="multiplayer-auto-daub-checkbox"
            />
            Auto-Daub
          </label>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {gameData && gameData.cards && gameData.cards[0] && (
              <div className="max-w-md mx-auto">
                <BingoCard
                  card={gameData.cards[0]}
                  calledNumbers={calledNumbers}
                  onDaub={handleDaub}
                  autoDaub={autoDaub}
                />
              </div>
            )}
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

export default GameRoomPage;