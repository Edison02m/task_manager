const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Ruta para obtener todas las tareas
router.get('/', taskController.getAllTasks);

// Ruta para crear una tarea
router.post('/', taskController.createTask);

// Ruta para actualizar una tarea (actualización completa)
router.put('/:id', taskController.updateTask);

// Ruta para actualizar solo el estado de una tarea
router.patch('/:id', taskController.updateTaskStatus);

// Ruta para eliminar una tarea
router.delete('/:id', taskController.deleteTask);

module.exports = router;
