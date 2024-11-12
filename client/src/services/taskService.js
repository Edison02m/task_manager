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
    priority: taskData.priority,
    contact_id: taskData.contactId, // Agregar contact_id aquí
  }),
});


    if (!response.ok) throw new Error('Error al crear tarea');
    return await response.json();  // Retorna la tarea creada
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
    
    if (!response.ok) {
      throw new Error('Error al eliminar tarea');
    }
    
    // Si la respuesta está vacía, simplemente retornamos true
    // indicando que la eliminación fue exitosa
    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return true;
    }

    // Solo intentamos parsear JSON si hay contenido
    return await response.json();
  } catch (error) {
    console.error('Error en deleteTask:', error);
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


// Actualizar una tarea (solo el estado 'status')
// client/src/services/taskService.js

export const updateTaskStatus = async (taskId, updatedStatus) => {
  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: 'PATCH', // Cambiar a PATCH para actualizaciones parciales
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: updatedStatus }), // Solo enviamos el estado a actualizar
    });
    if (!response.ok) throw new Error('Error al actualizar estado de tarea');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};


// Actualizar una tarea completa
export const updateTask = async (id, updatedTask) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...updatedTask,
      contact_id: updatedTask.contactId, // Agregar contact_id al actualizar
    }),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar la tarea: ' + response.statusText);
  }

  return response.json(); // Devuelve los datos actualizados de la tarea
};