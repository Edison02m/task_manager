import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="absolute top-0 left-0 w-64 h-full bg-gray-800 text-white p-6 shadow-lg z-10">
      <h2 className="text-xl font-bold mb-6">Menú</h2>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link to="/" className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors">
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/create-task" className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors">
              Crear Tarea
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;