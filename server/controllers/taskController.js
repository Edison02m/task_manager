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
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const newTask = await Task.create(req.body);
        res.status(201).json(newTask);
    } catch (error) {
        console.error(error);  // Muestra el error en la consola para depuración
        res.status(500).json({ error: 'Error al crear tarea' });
    }
};

// Controlador para obtener tareas por contacto
exports.getTasksByContact = async (req, res) => {
    const { contact_id } = req.params; // Obtener el contact_id desde los parámetros de la URL
    
    try {
        const tasks = await Task.getTasksByContact(contact_id);  // Usar el método del modelo para obtener tareas
        
        if (tasks.length === 0) {
            return res.status(404).json({ message: 'No se encontraron tareas para este contacto' });
        }
        
        // Si se encuentran tareas, enviarlas como respuesta
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener tareas por contacto' });
    }
};

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
            contact_id,
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


exports.getContacts = async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/api/contacts'); // URL de la API de contactos
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener contactos' });
    }
};