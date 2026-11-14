# Venue OS architecture and security notes

## Observed application shape

- `frontend/src/App.js` provides React Router routes for the home dashboard, legacy single-player/multiplayer experiences, game rooms, leaderboard, and Bar Mode.
- `frontend/src/pages/BarModePage.jsx` creates a `mode: "bar"` game, opens a WebSocket and provides host/player views.
- `backend/server.py` is a FastAPI application using Motor/MongoDB. Bingo card generation, pattern detection, game/room endpoints, leaderboard updates and WebSocket events currently live in this module.
- `backend/tests/test_progressive_patterns.py` covers progressive pattern rules against a running API.

## SaaS/security blockers to resolve before multi-venue deployment

1. Establish server-verified venue users and roles with secure session/token handling; remove the browser-side Bar Mode password check and never expose admin authorization secrets in frontend bundles.
2. Add an immutable venue identifier to games, rooms, players, and relevant activity data. Enforce tenant scope in every read/write query, API endpoint, and WebSocket handshake; use authorization tests proving cross-tenant access is rejected.
3. Plan migrations and indexes for venue-scoped queries and uniqueness constraints before applying tenant fields to existing records.
4. Restrict CORS to configured trusted origins in production and validate inputs/state transitions at the API boundary.

These are architectural requirements, not implemented authentication or tenant isolation. Adding an unverified venue ID supplied by the browser would not isolate tenants and is intentionally avoided.

## Current Music Bingo scope

The existing Bar Mode flow is preserved. The application currently calls bingo numbers; it does not provide a licensed music catalogue, track management, or music playback. Do not represent generated sound effects or speech announcements as music playback.
