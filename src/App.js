import "./App.css";
import MyNavigationBar from "./Components/Navbar.js";
import { TicTacToe } from "./Components/TictacToe";
import {
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";

import { Dashboard } from "./Components/Dashboard.js";
import { Contact } from "./Components/Contact.js";
import { Home } from "./Components/Home.js";

function App() {
  return (
    <BrowserRouter>
      <div>
        <MyNavigationBar />
        <div>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/" element={<Home />} />
            <Route path="/tictactoe" element ={<TicTacToe />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
