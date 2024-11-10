import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ListPlus } from 'lucide-react';

const Header = ({ tasks = [] }) => {
  const location = useLocation();

  // Calcular tareas pendientes (las que no están marcadas como 'Hecho')
  const pendingTasksCount = useMemo(() => {
    return tasks.filter(task => task.status !== 'Hecho').length;
  }, [tasks]);

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="absolute top-0 left-0 w-64 h-full bg-gradient-to-b from-gray-800 to-gray-900 text-gray-100 shadow-xl z-10">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Task Master
          </h2>
          <p className="text-sm text-gray-400 mt-2">Gestión de tareas</p>
        </div>

        <nav className="space-y-2">
          <Link 
            to="/" 
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
              ${isActiveLink('/') 
                ? 'bg-gray-700/50 text-white' 
                : 'text-gray-300 hover:bg-gray-700/30 hover:text-white'}`}
          >
            <Home className={`w-5 h-5 transition-colors duration-200
              ${isActiveLink('/') 
                ? 'text-blue-400' 
                : 'text-gray-400 group-hover:text-blue-400'}`} 
            />
            <span className="font-medium">Inicio</span>
          </Link>

          <Link 
            to="/create-task" 
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
              ${isActiveLink('/create-task') 
                ? 'bg-gray-700/50 text-white' 
                : 'text-gray-300 hover:bg-gray-700/30 hover:text-white'}`}
          >
            <ListPlus className={`w-5 h-5 transition-colors duration-200
              ${isActiveLink('/create-task') 
                ? 'text-blue-400' 
                : 'text-gray-400 group-hover:text-blue-400'}`} 
            />
            <span className="font-medium">Crear Tarea</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <Link 
            to="/"
            className="block bg-gray-700/30 rounded-lg p-4 hover:bg-gray-700/40 transition-colors duration-200"
          >
            <p className="text-sm text-gray-400 mb-2">Tareas Pendientes</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-white">{pendingTasksCount}</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
