// src/pages/HomePage.js
import React from 'react';
import Header from '../components/Header';
import TaskList from '../components/TaskList';

const HomePage = () => {
  return (
    <div className="flex h-screen">
      <Header />
      <div className="w-3/4 p-6">
        <TaskList />
      </div>
    </div>
  );
};

export default HomePage;
