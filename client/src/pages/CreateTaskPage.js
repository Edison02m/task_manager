import React from 'react';
import Header from '../components/Header';
import CreateTaskForm from '../components/CreateTaskForm';

const CreateTaskPage = () => {
  return (
    <div className="flex h-screen">
      {/* Header posicionado de forma absoluta */}
      <Header />
      
      {/* Contenedor principal para el formulario con margen izquierdo */}
      <div className="flex-1 h-full overflow-y-auto p-6 ml-64">
        <CreateTaskForm />
      </div>
    </div>
  );
};

export default CreateTaskPage;