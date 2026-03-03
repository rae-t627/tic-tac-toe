import "./App.css";
import MyNavigationBar from "./Components/Navbar.js";
import { HumanvHuman } from "./Components/HumanvHuman";
import {
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";

import { Dashboard } from "./Components/Dashboard.js";
import { Contact } from "./Components/Contact.js";
import { Home } from "./Components/Home.js";
import { HumanvComp } from "./Components/HumanvComp";
import { GameHistoryProvider } from "./Components/GameHistoryContext";
import { GameHistory } from "./Components/GameHistory";
import { GameReplay } from "./Components/GameReplay";

function App() {
  return (
    <GameHistoryProvider>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <div>
          <MyNavigationBar />
          <div>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/history" element={<GameHistory />} />
              <Route path="/replay/:gameId" element={<GameReplay />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/" element={<Home />} />
              <Route path="/hvh" element ={<HumanvHuman />} />
              <Route path = "/hvc" element = {<HumanvComp/>} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </GameHistoryProvider>
  );
}

export default App;
