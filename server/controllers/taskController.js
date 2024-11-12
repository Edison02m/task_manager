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
        const { title, description, due_date, priority, contact_id } = req.body;

        // Validación de datos
        if (!title || !description || !due_date || !priority || !contact_id) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios, incluyendo el contacto' });
        }

        const newTask = await Task.create(req.body);
        res.status(201).json(newTask);
    } catch (error) {
        console.error(error);  // Muestra el error en la consola para depuración
        res.status(500).json({ error: 'Error al crear tarea' });
    }
};


// Método para actualizar todos los campos de la tarea
exports.updateTask = async (req, res) => {
    try {
        const { title, description, due_date, priority, status, contact_id } = req.body;

        // Validación de campos
        if (!title || !description || !due_date || !priority || !status || !contact_id) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Actualización de tarea
        const updatedTask = await Task.update(req.params.id, {
            title,
            description,
            due_date,
            priority,
            status,
            contact_id,  // Asegúrate de incluir contact_id
        });

        if (!updatedTask) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }

        res.status(200).json(updatedTask); // Devolver la tarea actualizada
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar tarea' });
    }
};


exports.updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body; // Recibir el nuevo estado
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
