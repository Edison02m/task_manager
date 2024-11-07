// client/src/pages/TaskPage.js

import React, { useState, useEffect } from 'react';
import { getTasks, deleteTask } from '../services/taskService';
import TaskList from '../components/TaskList';

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const tasksData = await getTasks();
      setTasks(tasksData);
    };
    fetchTasks();
  }, []);

  const handleDelete = async (taskId) => {
    await deleteTask(taskId);
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <div className="p-4">
      <h2>Todas las Tareas</h2>
      <TaskList tasks={tasks} onDelete={handleDelete} />
    </div>
  );
};

export default TaskPage;
