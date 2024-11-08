// taskModel.js
const db = require('../config/db');

const Task = {
  getAll: async () => db.query('SELECT * FROM tasks'),
  create: async ({ title, description, due_date, priority }) => {
    const result = await db.query(
      'INSERT INTO tasks (title, description, due_date, priority) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, due_date, priority]
    );
    return result.rows[0];
  },
  
  // Actualizar completamente la tarea
  update: async (id, { title, description, due_date, priority, status }) => {
    const result = await db.query(
      'UPDATE tasks SET title = $1, description = $2, due_date = $3, priority = $4, status = $5 WHERE id = $6 RETURNING *',
      [title, description, due_date, priority, status, id]
    );
    return result.rows[0]; // Devuelve la tarea actualizada
  },
  
  updateStatus: async (id, status) => {
    const result = await db.query(
      'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0]; // Devuelve la tarea actualizada
  },

  delete: async (id) => db.query('DELETE FROM tasks WHERE id = $1', [id]),
};

module.exports = Task;
