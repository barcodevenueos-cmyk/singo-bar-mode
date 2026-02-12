import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { NeoButton } from '../components/ui/NeoButton';
import { NeoInput } from '../components/ui/NeoInput';
import { NeoCard } from '../components/ui/NeoCard';
import { ArrowLeft, Plus, Users, RefreshCw } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MultiplayerPage = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('lobby');
  const [roomName, setRoomName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    loadRooms();
  }, []);
  
  const loadRooms = async () => {
    try {
      const response = await axios.get(`${API}/room/list`);
      setRooms(response.data);
    } catch (error) {
      console.error('Error loading rooms:', error);
    }
  };
  
  const createRoom = async () => {
    if (!roomName.trim() || !playerName.trim()) {
      alert('Please enter both room name and your name');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${API}/room/create`, null, {
        params: {
          room_name: roomName,
          host_name: playerName,
          max_players: 4
        }
      });
      
      navigate(`/game-room/${response.data.room_id}?player_id=${response.data.host_id}&player_name=${playerName}`);
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room');
    } finally {
      setLoading(false);
    }
  };
  
  const joinRoom = async (roomId) => {
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${API}/room/${roomId}/join`, null, {
        params: { player_name: playerName }
      });
      
      navigate(`/game-room/${roomId}?player_id=${response.data.player_id}&player_name=${playerName}`);
    } catch (error) {
      console.error('Error joining room:', error);
      alert(error.response?.data?.detail || 'Failed to join room');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-cream p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <NeoButton
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-8"
          testId="back-to-home-btn"
        >
          <ArrowLeft className="w-5 h-5 inline mr-2" />
          Back to Home
        </NeoButton>
        
        <h1 className="font-primary text-4xl md:text-6xl uppercase tracking-tight mb-8 text-center">
          Multiplayer Lobby
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <NeoCard>
            <h2 className="font-primary text-2xl uppercase mb-4">Create Room</h2>
            <div className="space-y-4">
              <div>
                <label className="font-mono text-xs uppercase tracking-widest font-bold block mb-2">
                  Your Name
                </label>
                <NeoInput
                  placeholder="Enter your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  testId="create-room-player-name-input"
                />
              </div>
              <div>
                <label className="font-mono text-xs uppercase tracking-widest font-bold block mb-2">
                  Room Name
                </label>
                <NeoInput
                  placeholder="Enter room name"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  testId="room-name-input"
                />
              </div>
              <NeoButton
                variant="primary"
                onClick={createRoom}
                disabled={loading}
                className="w-full"
                testId="create-room-btn"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                Create Room
              </NeoButton>
            </div>
          </NeoCard>
          
          <NeoCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-primary text-2xl uppercase">Available Rooms</h2>
              <NeoButton
                variant="ghost"
                onClick={loadRooms}
                testId="refresh-rooms-btn"
              >
                <RefreshCw className="w-5 h-5" />
              </NeoButton>
            </div>
            
            {!playerName.trim() && (
              <div className="mb-4">
                <label className="font-mono text-xs uppercase tracking-widest font-bold block mb-2">
                  Your Name (to join)
                </label>
                <NeoInput
                  placeholder="Enter your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  testId="join-room-player-name-input"
                />
              </div>
            )}
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {rooms.length === 0 ? (
                <p className="text-center font-secondary text-gray-500 py-8">
                  No rooms available. Create one!
                </p>
              ) : (
                rooms.map((room) => (
                  <div
                    key={room.room_id}
                    className="bg-white border-2 border-black p-4 shadow-hard-sm"
                    data-testid={`room-${room.room_id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-primary text-xl uppercase">{room.room_name}</h3>
                        <p className="font-secondary text-sm">
                          <Users className="w-4 h-4 inline mr-1" />
                          {room.player_ids.length} / {room.max_players} players
                        </p>
                      </div>
                      <NeoButton
                        variant="secondary"
                        onClick={() => joinRoom(room.room_id)}
                        disabled={loading || room.player_ids.length >= room.max_players}
                        testId={`join-room-${room.room_id}-btn`}
                      >
                        Join
                      </NeoButton>
                    </div>
                  </div>
                ))
              )}
            </div>
          </NeoCard>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerPage;