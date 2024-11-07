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
        const { title, description, due_date, priority } = req.body;
        
        // Validación de datos
        if (!title || !description || !due_date || !priority) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const newTask = await Task.create(req.body);
        res.status(201).json(newTask);
    } catch (error) {
        console.error(error);  // Muestra el error en la consola para depuración
        res.status(500).json({ error: 'Error al crear tarea' });
    }
};


exports.updateTaskStatus = async (req, res) => {
    try {
        const updatedTask = await Task.updateStatus(req.params.id, req.body.status);
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
