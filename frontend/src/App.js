import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SinglePlayerPage from "./pages/SinglePlayerPage";
import MultiplayerPage from "./pages/MultiplayerPage";
import GameRoomPage from "./pages/GameRoomPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/single-player" element={<SinglePlayerPage />} />
          <Route path="/multiplayer" element={<MultiplayerPage />} />
          <Route path="/game-room/:roomId" element={<GameRoomPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;