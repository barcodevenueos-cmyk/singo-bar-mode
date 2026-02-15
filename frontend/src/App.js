import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SinglePlayerPage from "./pages/SinglePlayerPage";
import MultiplayerPage from "./pages/MultiplayerPage";
import GameRoomPage from "./pages/GameRoomPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import BarModePage from "./pages/BarModePage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/single-player" element={<SinglePlayerPage />} />
          <Route path="/multiplayer" element={<MultiplayerPage />} />
          <Route path="/game-room/:roomId" element={<GameRoomPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/bar-mode" element={<BarModePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;