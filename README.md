# VENUE OS

Venue OS is the hospitality entertainment platform foundation in this repository. The current application is a React single-page app with a FastAPI API and MongoDB persistence. Music Bingo (currently implemented as Bar Mode) is the operational experience; other dashboard tiles are intentionally unavailable.

## Existing functionality

The existing Bar Mode game includes bingo card creation, manual/automatic number calls, player card daubing, progressive Four Corners → Line → Full House tracking, WebSocket event updates, sound effects, and browser speech utilities. It does not currently implement licensed music playback or music-track management. Existing single-player, multiplayer, game-room, and leaderboard routes remain in the codebase but are not exposed as new dashboard categories.

## Run locally

Start the API from `backend/` after installing its requirements and configuring the MongoDB environment:

```bash
cd backend
pip install -r requirements.txt
export MONGO_URL='mongodb://localhost:27017'
export DB_NAME='venue_os'
uvicorn server:app --reload
```

Start the frontend in a second terminal:

```bash
cd frontend
yarn install
yarn start
```

Set `REACT_APP_BACKEND_URL` in the frontend environment to the API base URL (for example `http://localhost:8000`). Do not place server credentials in `REACT_APP_*` variables; Create React App embeds them in browser bundles.

Run the frontend production build and test runner from `frontend/`:

```bash
yarn build
yarn test --watchAll=false
```

## Security and SaaS readiness

The current backend stores games, rooms, and leaderboard entries without venue identifiers or tenant-scoped queries. It has no authenticated venue identity. The existing Bar Mode admin check is performed in client-side code and contains a hardcoded password, so it is not a secure authorization boundary. Do not deploy this version for private or cross-venue data until server-side authentication and authorization, tenant-scoped persistence and WebSocket checks, and appropriate migration/tests are implemented. The dashboard is a presentation layer and does not claim tenant isolation or user authentication.

No environment variable is a substitute for server-side authorization. Music playback/licensing, subscriptions, payment processing, venue registration, and player QR onboarding remain future work.
