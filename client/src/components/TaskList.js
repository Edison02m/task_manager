import React, { useEffect, useState } from 'react';
import { getTasks, updateTaskStatus, updateTask, deleteTask } from '../services/taskService';
import TaskModal from '../components/Modal';
import { TrashIcon } from '@heroicons/react/outline';
import { toast } from 'react-toastify';
import Header from './Header';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Estados para los filtros
  const [priorityFilter, setPriorityFilter] = useState('todas');
  const [dateFilter, setDateFilter] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, priorityFilter, dateFilter, searchTerm]);

  const applyFilters = () => {
    let filtered = [...tasks];

    // Filtro por prioridad
    if (priorityFilter !== 'todas') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    // Filtro por fecha
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (dateFilter) {
      case 'hoy':
        filtered = filtered.filter(task => {
          const taskDate = new Date(task.due_date);
          taskDate.setHours(0, 0, 0, 0);
          return taskDate.getTime() === today.getTime();
        });
        break;
      case 'semana':
        const weekFromNow = new Date(today);
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        filtered = filtered.filter(task => {
          const taskDate = new Date(task.due_date);
          return taskDate >= today && taskDate <= weekFromNow;
        });
        break;
      case 'mes':
        const monthFromNow = new Date(today);
        monthFromNow.setMonth(monthFromNow.getMonth() + 1);
        filtered = filtered.filter(task => {
          const taskDate = new Date(task.due_date);
          return taskDate >= today && taskDate <= monthFromNow;
        });
        break;
      case 'vencidas':
        filtered = filtered.filter(task => {
          const taskDate = new Date(task.due_date);
          taskDate.setHours(0, 0, 0, 0);
          return taskDate < today && task.status !== 'Hecho';
        });
        break;
    }

    // Filtro por término de búsqueda
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
      );
    }

    setFilteredTasks(filtered);
  };

  const handleStatusChange = async (task) => {
    const updatedStatus = task.status === 'Hecho' ? 'Por hacer' : 'Hecho';
    try {
      await updateTaskStatus(task.id, updatedStatus);
      setTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === task.id ? { ...t, status: updatedStatus } : t
        )
      );
      toast.success(`Tarea marcada como ${updatedStatus}`);
    } catch (error) {
      console.error('Error al actualizar el estado de la tarea:', error);
      toast.error('Error al actualizar el estado de la tarea');
    }
  };

  const handleCheckboxClick = async (event, task) => {
    event.stopPropagation();
    await handleStatusChange(task);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleContainerClick = (event, task) => {
    if (event.target.type !== 'checkbox' && !event.target.classList.contains('delete-button')) {
      setSelectedTask(task);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleTaskUpdate = async (updatedTask) => {
    try {
      const updatedTaskData = await updateTask(updatedTask.id, updatedTask);
      setTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === updatedTaskData.id ? updatedTaskData : t
        )
      );
      setIsModalOpen(false);
      toast.success('Tarea actualizada exitosamente');
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
      toast.error('Error al actualizar la tarea');
    }
  };

  const handleDeleteTask = async (event, taskId) => {
    event.preventDefault();
    event.stopPropagation();

    if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      setIsDeleting(true);
      try {
        const result = await deleteTask(taskId);
        if (result) {  // Si la eliminación fue exitosa
          setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
          toast.success('Tarea eliminada exitosamente');
        }
      } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        toast.error('Error al eliminar la tarea');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  };

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const tasksData = await getTasks();
      setTasks(tasksData);
      setFilteredTasks(tasksData);
    } catch (error) {
      console.error('Error al obtener tareas:', error);
      toast.error('No se pudieron cargar las tareas');
    } finally {
      setIsLoading(false);
    }
  };

  // ... (mantener el resto de las funciones existentes sin cambios)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <Header tasks={tasks} />
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
          Lista de Tareas
        </h2>

        {/* Filtros */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Barra de búsqueda */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar tareas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Filtro de Prioridad */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="todas">Todas las prioridades</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>

            {/* Filtro de Fecha */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="todas">Todas las fechas</option>
              <option value="hoy">Hoy</option>
              <option value="semana">Esta semana</option>
              <option value="mes">Este mes</option>
              <option value="vencidas">Vencidas</option>
            </select>
          </div>

          {/* Resumen de filtros activos */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Mostrando:</span>
            {filteredTasks.length} de {tasks.length} tareas
            {(priorityFilter !== 'todas' || dateFilter !== 'todas' || searchTerm) && (
              <button
                onClick={() => {
                  setPriorityFilter('todas');
                  setDateFilter('todas');
                  setSearchTerm('');
                }}
                className="ml-2 text-blue-500 hover:text-blue-600"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-gray-500 text-lg">
              No hay tareas que coincidan con los filtros seleccionados
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden"
                onClick={(event) => handleContainerClick(event, task)}
              >
                {/* ... (mantener el contenido existente de la tarjeta de tarea) */}
                <div className="relative p-5">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 pt-1">
                      <input
                        type="checkbox"
                        checked={task.status === 'Hecho'}
                        onChange={(event) => handleCheckboxClick(event, task)}
                        className="w-5 h-5 rounded-full border-2 border-gray-300 text-green-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex-grow min-w-0">
                      <h3 className={`text-base font-medium mb-1 ${task.status === 'Hecho'
                        ? 'text-gray-400 line-through'
                        : 'text-gray-900'
                        } truncate`}>
                        {task.title}
                      </h3>
                      <p className={`${task.status === 'Hecho'
                        ? 'text-gray-400'
                        : 'text-gray-600'
                        } text-sm truncate`}>
                        {task.description}
                      </p>

                      <div className="flex items-center space-x-4 mt-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${task.priority === 'alta'
                            ? 'bg-red-100 text-red-700'
                            : task.priority === 'media'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                          {task.priority}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {formatDate(task.due_date)}
                        </span>
                      </div>
                    </div>

                    <button
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200
                      text-gray-400 hover:text-red-500 focus:outline-none focus:text-red-500"
                      onClick={(e) => handleDeleteTask(e, task.id)}
                      disabled={isDeleting}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <TaskModal
          isModalOpen={isModalOpen}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
          handleCloseModal={handleCloseModal}
          handleTaskUpdate={handleTaskUpdate}
        />
      </div>
    </div>
  );
};

export default TaskList;