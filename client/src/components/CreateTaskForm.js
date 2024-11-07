import React, { useState } from 'react';
import { createTask } from '../services/taskService'; // Importa el servicio de tareas

const CreateTaskForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Baja');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = { title, description, dueDate, priority };
    try {
      await createTask(taskData); // Llama a la función para crear la tarea
      alert('Tarea creada exitosamente');
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('baja');
    } catch (error) {
      alert('Error al crear tarea');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md w-full max-w-lg">
      <h2 className="text-2xl font-bold mb-4">Crear Tarea</h2>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Fecha de Vencimiento</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Prioridad</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Crear Tarea
      </button>
    </form>
  );
};

export default CreateTaskForm;
