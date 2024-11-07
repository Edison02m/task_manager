// client/src/services/taskServices.js

const API_URL = 'http://localhost:5000/api/tasks'; // URL base de la API

// Obtener todas las tareas
export const getTasks = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al obtener tareas');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Crear una nueva tarea
export const createTask = async (taskData) => {
  try {
    // taskService.js (al enviar la tarea)
const response = await fetch(API_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: taskData.title, 
    description: taskData.description, 
    due_date: taskData.dueDate, 
    priority: taskData.priority
  }),
});


    if (!response.ok) throw new Error('Error al crear tarea');
    return await response.json();  // Retorna la tarea creada
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Actualizar una tarea
export const updateTask = async (taskId, updatedTask) => {
  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    });
    if (!response.ok) throw new Error('Error al actualizar tarea');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Eliminar una tarea
export const deleteTask = async (taskId) => {
  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar tarea');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Obtener una tarea específica por su ID
export const getTaskById = async (taskId) => {
  try {
    const response = await fetch(`${API_URL}/${taskId}`);
    if (!response.ok) throw new Error('Error al obtener la tarea');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
