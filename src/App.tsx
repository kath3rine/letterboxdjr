import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Stats from './pages/Stats'
import Diary from './pages/Diary'
import movieObjects26 from './data/movies26.json';
import tvObjects26 from './data/shows26.json';
import theaterObjects26 from './data/theater26.json'
import movieObjects25 from './data/movies25.json';
import tvObjects25 from './data/shows25.json';
import theaterObjects25 from './data/theater25.json'
import '../src/App.css'

function App() {
  return (
    <Router basename="/letterboxdjr">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/diary26" element={
          <Diary year="2026"
            movieObjects={movieObjects26}
            tvObjects={tvObjects26}
            theaterObjects={theaterObjects26}/>
          } />
        <Route path="/stats26" element={
        <Stats year="2026"
            movieObjects={movieObjects26}
            tvObjects={tvObjects26}
            theaterObjects={theaterObjects26}/>} 
          />
        <Route path="/diary25" element={
        <Diary year="2025"
            movieObjects={movieObjects25}
            tvObjects={tvObjects25}
            theaterObjects={theaterObjects25}/>} 
          />
        <Route path="/stats25" element={
        <Stats year="2025"
            movieObjects={movieObjects25}
            tvObjects={tvObjects25}
            theaterObjects={theaterObjects25}/>
          } />
      </Routes>
    </Router>
  );
}

export default App;