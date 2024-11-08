import React from 'react';
import Header from '../components/Header';
import TaskList from '../components/TaskList';

const HomePage = () => {
  return (
    <div className="relative h-screen">
      {/* Header fijo al lado izquierdo */}
      <Header />

      {/* Contenedor principal para las tareas, se mueve hacia la derecha ocupando el espacio restante */}
      <div className="flex-1 h-full overflow-y-auto p-6 ml-64">
        <TaskList />
      </div>
    </div>
  );
};

export default HomePage;
