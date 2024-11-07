// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="w-1/4 h-full bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Menú</h2>
      <nav>
        <ul>
          <li className="mb-2">
            <Link to="/" className="hover:text-gray-400">Inicio</Link>
          </li>
          <li className="mb-2">
            <Link to="/create-task" className="hover:text-gray-400">Crear Tarea</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
