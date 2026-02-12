from fastapi import FastAPI, APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Set
import uuid
from datetime import datetime, timezone
import random
import asyncio
import json

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

class BingoCard(BaseModel):
    model_config = ConfigDict(extra="ignore")
    card_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    numbers: List[List[int]]
    daubed: List[List[bool]]

class Player(BaseModel):
    model_config = ConfigDict(extra="ignore")
    player_id: str
    player_name: str
    cards: List[BingoCard]
    is_winner: bool = False

class Game(BaseModel):
    model_config = ConfigDict(extra="ignore")
    game_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    mode: str
    players: List[Player] = []
    called_numbers: List[int] = []
    remaining_numbers: List[int] = []
    is_active: bool = False
    winner_id: Optional[str] = None
    pattern: str = "any"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LeaderboardEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    player_name: str
    wins: int = 0
    games_played: int = 0
    win_rate: float = 0.0
    last_played: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class GameRoom(BaseModel):
    model_config = ConfigDict(extra="ignore")
    room_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    room_name: str
    host_id: str
    max_players: int = 4
    player_ids: List[str] = []
    status: str = "waiting"
    game_id: Optional[str] = None

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.game_connections: Dict[str, Set[str]] = {}
    
    async def connect(self, player_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[player_id] = websocket
    
    def disconnect(self, player_id: str):
        if player_id in self.active_connections:
            del self.active_connections[player_id]
    
    async def send_personal_message(self, message: dict, player_id: str):
        if player_id in self.active_connections:
            await self.active_connections[player_id].send_json(message)
    
    async def broadcast_to_game(self, message: dict, game_id: str):
        if game_id in self.game_connections:
            for player_id in self.game_connections[game_id]:
                await self.send_personal_message(message, player_id)
    
    def add_to_game(self, player_id: str, game_id: str):
        if game_id not in self.game_connections:
            self.game_connections[game_id] = set()
        self.game_connections[game_id].add(player_id)
    
    def remove_from_game(self, player_id: str, game_id: str):
        if game_id in self.game_connections:
            self.game_connections[game_id].discard(player_id)

manager = ConnectionManager()

def generate_bingo_card() -> BingoCard:
    numbers = []
    for col in range(5):
        col_nums = random.sample(range(col * 15 + 1, col * 15 + 16), 5)
        numbers.append(col_nums)
    
    transposed = [[numbers[j][i] for j in range(5)] for i in range(5)]
    transposed[2][2] = 0
    
    daubed = [[False] * 5 for _ in range(5)]
    daubed[2][2] = True
    
    return BingoCard(numbers=transposed, daubed=daubed)

def check_win(card: BingoCard, pattern: str = "any") -> bool:
    daubed = card.daubed
    
    if pattern == "any" or pattern == "line":
        for row in daubed:
            if all(row):
                return True
        
        for col in range(5):
            if all(daubed[row][col] for row in range(5)):
                return True
    
    if pattern == "any" or pattern == "diagonal":
        if all(daubed[i][i] for i in range(5)):
            return True
        if all(daubed[i][4-i] for i in range(5)):
            return True
    
    if pattern == "any" or pattern == "four_corners":
        if daubed[0][0] and daubed[0][4] and daubed[4][0] and daubed[4][4]:
            return True
    
    if pattern == "any" or pattern == "x":
        if all(daubed[i][i] for i in range(5)) and all(daubed[i][4-i] for i in range(5)):
            return True
    
    if pattern == "any" or pattern == "full_house":
        if all(all(row) for row in daubed):
            return True
    
    return False

@api_router.post("/game/create")
async def create_game(mode: str, player_name: str, num_cards: int = 1, pattern: str = "any"):
    player_id = str(uuid.uuid4())
    cards = [generate_bingo_card() for _ in range(num_cards)]
    
    player = Player(player_id=player_id, player_name=player_name, cards=cards)
    
    game = Game(
        mode=mode,
        players=[player],
        remaining_numbers=list(range(1, 76)),
        pattern=pattern
    )
    
    game_dict = game.model_dump()
    game_dict['created_at'] = game_dict['created_at'].isoformat()
    await db.games.insert_one(game_dict)
    
    await update_leaderboard(player_name, games_played=1)
    
    return {"game_id": game.game_id, "player_id": player_id, "cards": cards}

@api_router.post("/game/{game_id}/start")
async def start_game(game_id: str):
    game_doc = await db.games.find_one({"game_id": game_id}, {"_id": 0})
    if not game_doc:
        raise HTTPException(status_code=404, detail="Game not found")
    
    await db.games.update_one(
        {"game_id": game_id},
        {"$set": {"is_active": True}}
    )
    
    return {"status": "started"}

@api_router.post("/game/{game_id}/call-number")
async def call_number(game_id: str):
    game_doc = await db.games.find_one({"game_id": game_id}, {"_id": 0})
    if not game_doc:
        raise HTTPException(status_code=404, detail="Game not found")
    
    remaining = game_doc.get('remaining_numbers', [])
    if not remaining:
        return {"number": None, "game_over": True}
    
    number = random.choice(remaining)
    remaining.remove(number)
    called = game_doc.get('called_numbers', [])
    called.append(number)
    
    await db.games.update_one(
        {"game_id": game_id},
        {"$set": {"called_numbers": called, "remaining_numbers": remaining}}
    )
    
    await manager.broadcast_to_game({
        "type": "number_called",
        "number": number,
        "called_numbers": called
    }, game_id)
    
    return {"number": number, "called_numbers": called}

@api_router.post("/game/{game_id}/daub")
async def daub_number(game_id: str, player_id: str, card_id: str, row: int, col: int):
    game_doc = await db.games.find_one({"game_id": game_id}, {"_id": 0})
    if not game_doc:
        raise HTTPException(status_code=404, detail="Game not found")
    
    pattern = game_doc.get('pattern', 'any')
    players = game_doc.get('players', [])
    for player in players:
        if player['player_id'] == player_id:
            for card in player['cards']:
                if card['card_id'] == card_id:
                    card['daubed'][row][col] = True
                    
                    is_winner = check_win(BingoCard(**card), pattern)
                    if is_winner:
                        player['is_winner'] = True
                        await db.games.update_one(
                            {"game_id": game_id},
                            {"$set": {"players": players, "winner_id": player_id, "is_active": False}}
                        )
                        
                        await update_leaderboard(player['player_name'], wins=1)
                        
                        await manager.broadcast_to_game({
                            "type": "game_won",
                            "winner_id": player_id,
                            "winner_name": player['player_name']
                        }, game_id)
                        
                        return {"daubed": True, "winner": True}
                    
                    await db.games.update_one(
                        {"game_id": game_id},
                        {"$set": {"players": players}}
                    )
                    return {"daubed": True, "winner": False}
    
    raise HTTPException(status_code=404, detail="Card not found")

@api_router.get("/game/{game_id}")
async def get_game(game_id: str):
    game_doc = await db.games.find_one({"game_id": game_id}, {"_id": 0})
    if not game_doc:
        raise HTTPException(status_code=404, detail="Game not found")
    return game_doc

@api_router.post("/room/create")
async def create_room(room_name: str, host_name: str, max_players: int = 4):
    host_id = str(uuid.uuid4())
    room = GameRoom(
        room_name=room_name,
        host_id=host_id,
        max_players=max_players,
        player_ids=[host_id]
    )
    
    room_dict = room.model_dump()
    await db.rooms.insert_one(room_dict)
    
    return {"room_id": room.room_id, "host_id": host_id}

@api_router.get("/room/list")
async def list_rooms():
    rooms = await db.rooms.find({"status": "waiting"}, {"_id": 0}).to_list(100)
    return rooms

@api_router.post("/room/{room_id}/join")
async def join_room(room_id: str, player_name: str):
    room_doc = await db.rooms.find_one({"room_id": room_id}, {"_id": 0})
    if not room_doc:
        raise HTTPException(status_code=404, detail="Room not found")
    
    if len(room_doc['player_ids']) >= room_doc['max_players']:
        raise HTTPException(status_code=400, detail="Room is full")
    
    player_id = str(uuid.uuid4())
    room_doc['player_ids'].append(player_id)
    
    await db.rooms.update_one(
        {"room_id": room_id},
        {"$set": {"player_ids": room_doc['player_ids']}}
    )
    
    return {"player_id": player_id, "room": room_doc}

@api_router.get("/room/{room_id}")
async def get_room(room_id: str):
    room_doc = await db.rooms.find_one({"room_id": room_id}, {"_id": 0})
    if not room_doc:
        raise HTTPException(status_code=404, detail="Room not found")
    return room_doc

@api_router.websocket("/ws/{game_id}/{player_id}")
async def websocket_endpoint(websocket: WebSocket, game_id: str, player_id: str):
    await manager.connect(player_id, websocket)
    manager.add_to_game(player_id, game_id)
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get('type') == 'auto_call':
                game_doc = await db.games.find_one({"game_id": game_id}, {"_id": 0})
                if game_doc and game_doc.get('is_active') and game_doc.get('remaining_numbers'):
                    await call_number(game_id)
            
    except WebSocketDisconnect:
        manager.disconnect(player_id)
        manager.remove_from_game(player_id, game_id)

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()