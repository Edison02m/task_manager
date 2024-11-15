// server/controllers/taskController.js
const Task = require('../models/taskModel');

exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.getAll();
        res.status(200).json(tasks.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener tareas' });
    }
};

exports.createTask = async (req, res) => {
    try {
      const { title, description, due_date, priority, contact_ids } = req.body;
  
      if (!title || !description || !due_date || !priority) {
        return res.status(400).json({ error: 'Los campos título, descripción, fecha de vencimiento y prioridad son obligatorios' });
      }
  
      const newTask = await Task.create({
        title,
        description,
        due_date,
        priority,
        contact_ids: contact_ids || [],  
      });
  
      res.status(201).json(newTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear tarea' });
    }
  };
  

  exports.updateTask = async (req, res) => {
    try {
      const { title, description, due_date, priority, status, contact_ids } = req.body;
  
      if (!title || !description || !due_date || !priority || !status) {
        return res.status(400).json({ error: 'Los campos título, descripción, fecha de vencimiento, prioridad y estado son obligatorios' });
      }
  
      const updatedData = {
        title,
        description,
        due_date,
        priority,
        status,
        contact_ids: contact_ids || [],  
      };
  
      const updatedTask = await Task.update(req.params.id, updatedData);
  
      if (!updatedTask) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
      }
  
      res.status(200).json(updatedTask); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar tarea' });
    }
  };
  


exports.updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const updatedTask = await Task.updateStatus(req.params.id, status);
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar estado de tarea' });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        await Task.delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar tarea' });
    }
};

/*
exports.getContacts = async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/api/contacts');
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener contactos' });
    }
};*/

