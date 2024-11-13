import React, { useEffect, useState } from 'react';
import { getTasks, updateTaskStatus, updateTask, deleteTask } from '../services/taskService';
import TaskModal from '../components/Modal';
import { TrashIcon } from '@heroicons/react/outline';
import { toast } from 'react-toastify';
import Header from './Header';
import {  UserCircleIcon, CalendarIcon } from 'lucide-react';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  // Estados para los filtros
  const [priorityFilter, setPriorityFilter] = useState('todas');
  const [dateFilter, setDateFilter] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Esta función se ejecutará cada vez que accedas a la ventana de tareas
    const fetchTasks = async () => {
      setIsLoading(true); // Establecer isLoading en true cuando comience la carga
      try {
        // Obtener las tareas
        const response = await fetch('http://localhost:5001/api/tasks');
        const tasksData = await response.json();
        setTasks(tasksData);

        // Obtener el contacto asociado a cada tarea
        tasksData.forEach(async (task) => {
          if (task.contact_id) {
            try {
              // Obtener el contacto por su ID
              const contactResponse = await fetch(`http://localhost:5000/api/contacts/${task.contact_id}`);
              const contact = await contactResponse.json();
              // Actualizar la tarea con el nombre del contacto
              task.contact_name = contact.name;
              setTasks((prevTasks) => [...prevTasks]); // Actualizar el estado
            } catch (error) {
              console.error('Error al obtener el contacto:', error);
            }
          }
        });
      } catch (error) {
        console.error('Error al obtener las tareas:', error);
      } finally {
        setIsLoading(false); // Marcar como no cargando una vez que los datos hayan sido cargados
      }
    };

    fetchTasks();
  }, []); // Solo se ejecuta una vez al montar el componente

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/contacts');
        const contactsData = await response.json();
        setAllContacts(contactsData);
      } catch (error) {
        console.error('Error al obtener los contactos:', error);
      }
    };
  
    fetchContacts();
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
      // Actualiza la tarea a través del API
      const updatedTaskData = await updateTask(updatedTask.id, updatedTask);
  
      // Verifica los datos actualizados
      console.log('Tarea actualizada:', updatedTaskData);  // Verifica si la tarea se actualizó correctamente
  
      // Actualiza el estado de las tareas
      setTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === updatedTaskData.id ? updatedTaskData : t
        )
      );
  
      // Cierra el modal y muestra el mensaje de éxito
      setIsModalOpen(false);
      toast.success('Tarea actualizada exitosamente');
  
      // Recarga la página para reflejar los cambios inmediatamente
      window.location.reload();
      
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


  // ... (mantener el resto de las funciones existentes sin cambios)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <Header tasks={tasks} />
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Lista de Tareas
        </h2>

        {/* Filtros */}
        <div className="mb-8 bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Barra de búsqueda */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar tareas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50"
              />
            </div>

            {/* Filtros optimizados */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="todas">Todas las prioridades</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="todas">Todas las fechas</option>
              <option value="hoy">Hoy</option>
              <option value="semana">Esta semana</option>
              <option value="mes">Este mes</option>
              <option value="vencidas">Vencidas</option>
            </select>
          </div>

          {/* Resumen de filtros mejorado */}
          <div className="flex items-center gap-2 text-sm text-gray-600 border-t pt-4">
            <span className="font-medium">Tareas encontradas:</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {filteredTasks.length} de {tasks.length}
            </span>
            {(priorityFilter !== 'todas' || dateFilter !== 'todas' || searchTerm) && (
              <button
                onClick={() => {
                  setPriorityFilter('todas');
                  setDateFilter('todas');
                  setSearchTerm('');
                }}
                className="ml-auto text-blue-600 hover:text-blue-700 font-medium transition-colors"
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
                className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 overflow-hidden"
                onClick={(event) => handleContainerClick(event, task)}
              >
                <div className="relative p-5">
                  <div className="flex items-start space-x-4">
                    {/* Checkbox con mejor estilo */}
                    <div className="flex-shrink-0 pt-1">
                      <input
                        type="checkbox"
                        checked={task.status === 'Hecho'}
                        onChange={(event) => handleCheckboxClick(event, task)}
                        className="w-5 h-5 rounded-md border-2 border-gray-300 text-blue-500 cursor-pointer focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex-grow min-w-0">
                      {/* Título y descripción */}
                      <h3 className={`text-lg font-semibold mb-2 ${
                        task.status === 'Hecho'
                          ? 'text-gray-400 line-through'
                          : 'text-gray-900'
                      }`}>
                        {task.title}
                      </h3>
                      <p className={`${
                        task.status === 'Hecho'
                          ? 'text-gray-400'
                          : 'text-gray-600'
                      } text-sm mb-3`}>
                        {task.description}
                      </p>

                      {/* Metadatos mejorados */}
                      <div className="flex flex-wrap items-center gap-4">
                        {/* Prioridad */}
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize
                          ${task.priority === 'alta'
                            ? 'bg-red-100 text-red-700'
                            : task.priority === 'media'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                          {task.priority}
                        </span>

                        {/* Fecha con icono */}
                        <span className="inline-flex items-center text-gray-500 text-sm">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          {formatDate(task.due_date)}
                        </span>

                        {/* Contacto asignado */}
                        <span className="inline-flex items-center text-gray-600 text-sm">
                          <UserCircleIcon className="w-4 h-4 mr-1" />
                          {task.contact_name || "Sin asignar"}
                        </span>
                      </div>
                    </div>

                    {/* Botón eliminar mejorado */}
                    <button
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200
                        p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500"
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
  allContacts={allContacts} // Pasa los contactos aquí
/>
      </div>
    </div>
  );
};

export default TaskList;