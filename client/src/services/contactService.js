// client/src/services/contactService.js
export const getContacts = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/contacts');
        if (!response.ok) throw new Error('Error al obtener contactos');
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// client/src/services/taskService.js
export const getTasksByContact = async (contactId) => {
    try {
        const response = await fetch(`http://localhost:5000/api/tasks/contact/${contactId}`);
        if (!response.ok) throw new Error('Error al obtener tareas del contacto');
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};
