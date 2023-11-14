import React from 'react';
import logo from './logo.svg';
import './App.css';
import PageContainer from './components/PageContainer/PageContainer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MovieSearch from './components/MovieSearch/MovieSearch';
import MovieCard from './components/MovieCard/MovieCard';



const App: React.FC = () => {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<PageContainer />} />
        <Route path="/movie/:imdbID" element={<MovieSearch />} />
        <Route path="/movies" element={<MovieSearch />} />
      </Routes>
    </Router>
  );
};


export default App;
