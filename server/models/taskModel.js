const db = require('../config/db');

const Task = {
  getAll: async () => db.query('SELECT * FROM tasks'),

  // Crear tarea con el campo contact_id
  create: async ({ title, description, due_date, priority, contact_id }) => {
    const result = await db.query(
      'INSERT INTO tasks (title, description, due_date, priority, contact_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, due_date, priority, contact_id]
    );
    return result.rows[0];
  },

  // Actualizar completamente la tarea, incluyendo contact_id
  update: async (id, { title, description, due_date, priority, status, contact_id }) => {
    const result = await db.query(
      'UPDATE tasks SET title = $1, description = $2, due_date = $3, priority = $4, status = $5, contact_id = $6 WHERE id = $7 RETURNING *',
      [title, description, due_date, priority, status, contact_id, id]
    );
    return result.rows[0]; // Devuelve la tarea actualizada
  },

  // Solo actualizar el estado de la tarea
  updateStatus: async (id, status) => {
    const result = await db.query(
      'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  },

  // Eliminar tarea
  delete: async (id) => db.query('DELETE FROM tasks WHERE id = $1', [id]),
};

module.exports = Task;
