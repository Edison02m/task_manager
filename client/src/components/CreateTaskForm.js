import React, { useState } from 'react';
import { createTask } from '../services/taskService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateTaskForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('baja');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = { title, description, dueDate, priority };
    try {
      await createTask(taskData);
      toast.success("¡Tarea creada exitosamente!");
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('baja');
    } catch (error) {
      toast.error("Hubo un error al crear la tarea");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <div className="w-full max-w-2xl p-8">
      <form 
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-8 space-y-8 border border-gray-100"
      >
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-light text-gray-800">Nueva Tarea</h2>
          <p className="text-gray-500 text-sm">Completa los detalles de tu nueva tarea</p>
        </div>

        <div className="space-y-6">
          <div>
            <label 
              htmlFor="title" 
              className="text-sm font-medium text-gray-700 block mb-1"
            >
              Título
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
              placeholder="Ingresa el título de la tarea"
            />
          </div>

          <div>
            <label 
              htmlFor="description" 
              className="text-sm font-medium text-gray-700 block mb-1"
            >
              Descripción
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none resize-none"
              rows="4"
              placeholder="Describe los detalles de la tarea"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label 
                htmlFor="dueDate" 
                className="text-sm font-medium text-gray-700 block mb-1"
              >
                Fecha de vencimiento
              </label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
              />
            </div>

            <div>
              <label 
                htmlFor="priority" 
                className="text-sm font-medium text-gray-700 block mb-1"
              >
                Prioridad
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-[1.02] transition-all duration-200 font-medium"
        >
          Crear Tarea
        </button>
      </form>

      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  </div>
  );
};

export default CreateTaskForm;
