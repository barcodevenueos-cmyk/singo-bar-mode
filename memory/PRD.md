# Singo - Bingo App PRD

## Original Problem Statement
Build a bingo application with:
- Single-player and multiplayer modes
- Multiple card support
- Auto-daub feature
- Pattern variations for winning
- Call history
- LGBT-friendly theme (evolved to cyberpunk nightclub theme)

## Current Focus: Bar Mode
Bar Mode is the primary focus with:
- Password-protected Admin view (password: `5749`)
- Player view with bingo cards
- Progressive pattern system (Four Corners → Line → Full House)
- Auto-daub toggle for players
- QR code joining for multiplayer (pending)
- AI voice caller for admin (pending)

## What's Implemented

### Core Features (Complete)
- [x] Full-stack Bingo app with FastAPI + React + MongoDB
- [x] Cyberpunk pink/purple/silver nightclub theme
- [x] Musical notes animated background
- [x] Bar Mode with Admin/Player views
- [x] Admin password protection (5749)
- [x] Toggleable number daubing on cards
- [x] Auto-daub toggle checkbox
- [x] Leaderboard system
- [x] Sound effects system

### Progressive Pattern System (Complete - Dec 2025)
- [x] Four Corners pattern detection
- [x] Line pattern detection (row, column, diagonal)
- [x] Full House pattern detection (entire card)
- [x] Game ONLY ends when Full House is achieved
- [x] Pattern tracker UI showing progress
- [x] Pattern achievement notifications

### Disabled (by user request)
- Single Player mode (Coming Soon banner)
- Multiplayer mode (Coming Soon banner)

## Pending Tasks

### P0 - QR Code Player Joining
- Admin generates QR code for game session
- Players scan to join the game
- Long-press QR code for fullscreen

### P1 - AI Voice Bingo Caller
- Web Speech API integration
- Admin panel announces called numbers

### P2 - Populate Leaderboard
- Add 20 realistic fake player names and scores

## Technical Architecture

```
/app/
├── backend/
│   ├── server.py (FastAPI, WebSocket, MongoDB)
│   ├── models.py
│   └── tests/
└── frontend/
    └── src/
        ├── pages/BarModePage.jsx (main game logic)
        ├── components/BingoCard.jsx
        └── utils/sounds.js, voice.js
```

## Key API Endpoints
- `POST /api/game/create` - Create new game
- `POST /api/game/{id}/start` - Start game
- `POST /api/game/{id}/call-number` - Call next number
- `POST /api/game/{id}/daub` - Daub/undaub cell (returns pattern achievements for Bar Mode)
- `GET /api/leaderboard` - Get leaderboard

## Credentials
- Admin Password: `5749`
