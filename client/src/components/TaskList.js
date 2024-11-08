import React, { useEffect, useState } from 'react';
import { getTasks, updateTaskStatus, updateTask } from '../services/taskService';
import TaskModal from '../components/Modal'; // Importar el modal

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksData = await getTasks();
        setTasks(tasksData);
      } catch (error) {
        console.error('Error al obtener tareas:', error);
      }
    };
    fetchTasks();
  }, []);

  // Cambiar solo el estado de la tarea
  const handleStatusChange = async (task) => {
    const updatedStatus = task.status === 'Hecho' ? 'Por hacer' : 'Hecho';
    try {
      await updateTaskStatus(task.id, updatedStatus);
      setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status: updatedStatus } : t))); // Actualizamos solo el estado de la tarea
    } catch (error) {
      console.error('Error al actualizar el estado de la tarea:', error);
    }
  };

  const handleCheckboxClick = async (event, task) => {
    event.stopPropagation(); // Evitar que el clic en el checkbox abra el modal
    await handleStatusChange(task); // Cambiar el estado de la tarea
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleContainerClick = (event, task) => {
    if (event.target.type !== 'checkbox') { // Verificar si el clic no fue en el checkbox
      setSelectedTask(task);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleTaskUpdate = async (updatedTask) => {
    try {
      console.log('Updating task:', updatedTask);
      const updatedTaskData = await updateTask(updatedTask.id, updatedTask);
      console.log('Task updated:', updatedTaskData);
      setTasks(tasks.map((t) => (t.id === updatedTaskData.id ? updatedTaskData : t)));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4 text-gray-700 text-center">Lista de Tareas</h2>
      <div className="grid grid-cols-1 gap-4 w-full max-w-2xl">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="relative bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 flex flex-col"
            onClick={(event) => handleContainerClick(event, task)} // Abre el modal al hacer clic en el contenedor, excepto en el checkbox
          >
            <input
              type="checkbox"
              checked={task.status === 'Hecho'}
              onChange={(event) => handleCheckboxClick(event, task)} // Cambia el estado de la tarea sin abrir el modal
              className="absolute top-11 left-6 w-4 h-4 text-green-600 rounded focus:ring focus:ring-offset-1 focus:ring-green-400"
            />
            <div className="pl-12 pr-4">
              <h3 className="text-md font-medium text-gray-800 truncate">{task.title}</h3>
              <p className="text-gray-500 text-xs mt-1 truncate">{task.description}</p>
              <div className="flex justify-between items-center mt-3">
                <span
                  className={`px-2 py-0.5 rounded text-white text-xs font-medium ${
                    task.priority === 'alta' ? 'bg-red-500' : task.priority === 'media' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                >
                  {task.priority}
                </span>
                <span className="text-gray-400 text-xs">{formatDate(task.due_date)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Usar el modal importado */}
      <TaskModal
        isModalOpen={isModalOpen}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        handleCloseModal={handleCloseModal}
        handleTaskUpdate={handleTaskUpdate}
      />
    </div>
  );
};

export default TaskList;
