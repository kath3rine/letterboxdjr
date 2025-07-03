import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Diary from './pages/Diary';
import Stats from './pages/Stats'
import '../src/App.css'

function App() {
  return (
    <Router basename="/letterboxdjr">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/diary" element={<Diary />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </Router>
  );
}

export default App;