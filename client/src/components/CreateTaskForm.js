import React, { useState, useEffect } from 'react';
import { createTask } from '../services/taskService';
import { getContacts } from '../services/contactService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateTaskForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('baja');
  const [contactId, setContactId] = useState('');
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contactsData = await getContacts();
        setContacts(contactsData);
      } catch (error) {
        toast.error("Error al cargar los contactos");
      }
    };
    fetchContacts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const taskData = {
      title,
      description,
      dueDate,
      priority,
      contact_id: contactId || null, // Si contactId es vacío, pasar null
    };
  
    try {
      await createTask(taskData);
      toast.success("¡Tarea creada exitosamente!");
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('baja');
      setContactId('');
    } catch (error) {
      toast.error("Hubo un error al crear la tarea");
    }
  };
  

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-2xl p-4">
        <form 
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md p-6 space-y-1 border border-gray-100"
        >
          <div className="space-y-1 text-center mb-4">
            <h2 className="text-2xl text-gray-800">Nueva Tarea</h2>
            <p className="text-gray-500 text-xs">Completa los detalles de tu nueva tarea</p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="text-xs font-medium text-gray-700 block mb-1">
                Título
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200 outline-none text-sm"
                placeholder="Ingresa el título de la tarea"
              />
            </div>

            <div>
              <label htmlFor="description" className="text-xs font-medium text-gray-700 block mb-1">
                Descripción
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200 outline-none resize-none text-sm"
                rows="3"
                placeholder="Describe los detalles de la tarea"
              />
            </div>

            <div>
  <label htmlFor="contact" className="text-xs font-medium text-gray-700 block mb-1">
    Asignar a Contacto
  </label>
  <select
    id="contact"
    value={contactId || ""}
    onChange={(e) => setContactId(e.target.value)}
    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200 outline-none text-sm"
  >
    <option value="">Selecciona un contacto</option>
    {contacts.map(contact => (
      <option key={contact.id} value={contact.id}>
        {contact.name}
      </option>
    ))}
  </select>
</div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dueDate" className="text-xs font-medium text-gray-700 block mb-1">
                  Fecha
                </label>
                <input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 mb-8 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200 outline-none text-sm"
                />
              </div>

              <div>
                <label htmlFor="priority" className="text-xs font-medium text-gray-700 block mb-1">
                  Prioridad
                </label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200 outline-none text-sm"
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg 
            hover:from-blue-600 hover:to-blue-700 transform hover:translate-y-px 
            transition-all duration-200 font-medium shadow-sm
            focus:ring-2 focus:ring-blue-200 focus:outline-none
            active:from-blue-700 active:to-blue-800"
          >
            Crear Tarea
          </button>
        </form>

        <ToastContainer 
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
};

export default CreateTaskForm;
