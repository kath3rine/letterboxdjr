import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Diary25 from './pages/Diary25';
import Diary26 from './pages/Diary26';
import Stats25 from './pages/Stats25'
import Stats26 from './pages/Stats26'
import '../src/App.css'

function App() {
  return (
    <Router basename="/letterboxdjr">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/diary26" element={<Diary26 />} />
        <Route path="/stats26" element={<Stats26 />} />
        <Route path="/diary25" element={<Diary25 />} />
        <Route path="/stats25" element={<Stats25 />} />
      </Routes>
    </Router>
  );
}

export default App;