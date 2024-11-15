// server/models/taskModel.js
const db = require('../config/db');

const Task = {
  getAll: async () => db.query('SELECT * FROM tasks'),


  create: async ({ title, description, due_date, priority, contact_ids }) => {
    const result = await db.query(
      'INSERT INTO tasks (title, description, due_date, priority, contact_ids) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, due_date, priority, contact_ids]
    );
    return result.rows[0];
  },


  update: async (id, { title, description, due_date, priority, status, contact_ids }) => {
    const result = await db.query(
      'UPDATE tasks SET title = $1, description = $2, due_date = $3, priority = $4, status = $5, contact_ids = $6 WHERE id = $7 RETURNING *',
      [title, description, due_date, priority, status, contact_ids, id]
    );
    return result.rows[0]; 
  },

  
  updateStatus: async (id, status) => {
    const result = await db.query(
      'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  },

  
  delete: async (id) => db.query('DELETE FROM tasks WHERE id = $1', [id]),

};

module.exports = Task;
