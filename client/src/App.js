// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateTaskPage from './pages/CreateTaskPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-task" element={<CreateTaskPage />} />
      </Routes>
    </Router>
  );
}

export default App;
