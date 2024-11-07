import React, { useEffect, useState } from 'react';
import { getTasks } from '../services/taskService';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

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

  return (
    <div className="task-list">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Tareas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white p-4 rounded-lg shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
              <span
                className={`px-2 py-1 rounded-full text-white text-xs ${
                  task.priority === 'alta'
                    ? 'bg-red-500'
                    : task.priority === 'media'
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
              >
                {task.priority}
              </span>
            </div>
            <p className="text-gray-600 mb-4 text-sm">{task.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;