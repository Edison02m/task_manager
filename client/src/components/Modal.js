import React from 'react';

const TaskModal = ({ isModalOpen, selectedTask, setSelectedTask, handleCloseModal, handleTaskUpdate }) => {
  if (!isModalOpen || !selectedTask) return null;

  // Asegurarse de que la fecha esté en el formato correcto (YYYY-MM-DD)
  const formattedDate = selectedTask.due_date
    ? new Date(selectedTask.due_date).toISOString().split('T')[0] // Convierte a formato YYYY-MM-DD
    : '';

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Editar Tarea</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium">Título</label>
          <input
            type="text"
            value={selectedTask.title}
            onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
            className="mt-1 w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Descripción</label>
          <input
            type="text"
            value={selectedTask.description}
            onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
            className="mt-1 w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Fecha de vencimiento</label>
          <input
            type="date"
            value={formattedDate}  // Asegúrate de que la fecha esté en el formato correcto
            onChange={(e) => setSelectedTask({ ...selectedTask, due_date: e.target.value })}
            className="mt-1 w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Prioridad</label>
          <select
            value={selectedTask.priority}
            onChange={(e) => setSelectedTask({ ...selectedTask, priority: e.target.value })}
            className="mt-1 w-full p-2 border rounded"
          >
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Estado</label>
          <select
            value={selectedTask.status}
            onChange={(e) => setSelectedTask({ ...selectedTask, status: e.target.value })}
            className="mt-1 w-full p-2 border rounded"
          >
            <option value="Por hacer">Por hacer</option>
            <option value="Hecho">Hecho</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleCloseModal}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              await handleTaskUpdate(selectedTask);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
