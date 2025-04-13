import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Simulation from './components/Simulation';
import Game from './components/Game';
import LLMAssistant from './components/LLMAssistant';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="apple-nav">
          <div className="nav-content">
            <Link to="/" className="nav-logo">CFO Helper</Link>
            <div className="nav-links">
              <Link to="/" className="nav-link">Dashboard</Link>
              <Link to="/simulation" className="nav-link">Simulation</Link>
              <Link to="/game" className="nav-link">Game</Link>
              <Link to="/assistant" className="nav-link">AI Assistant</Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/game" element={<Game />} />
            <Route path="/assistant" element={<LLMAssistant />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 