import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const TaskModal = ({
  isModalOpen,
  selectedTask,
  setSelectedTask,
  handleCloseModal,
  handleTaskUpdate,
  allContacts,
}) => {
  if (!isModalOpen || !selectedTask) return null;

  // Asegurarse de que la fecha esté en el formato correcto (YYYY-MM-DD)
  const formattedDate = selectedTask.due_date
    ? new Date(selectedTask.due_date).toISOString().split('T')[0] // Convierte a formato YYYY-MM-DD
    : '';

  // Función para manejar la selección de contactos
  const handleContactChange = (selectedOptions) => {
    // Convertir las opciones seleccionadas a un array de ids de contactos
    const selectedContacts = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setSelectedTask({ ...selectedTask, contact_ids: selectedContacts });
  };

  // Filtrar los contactos que aún existen en la lista de todos los contactos
  const contactOptions = allContacts.map((contact) => ({
    value: contact.id,
    label: contact.name,
  }));

  // Filtrar los contactos seleccionados para asegurar que solo se muestren los que siguen existiendo
  const selectedContacts = selectedTask.contact_ids
    ? selectedTask.contact_ids
        .map((contactId) => {
          const contact = allContacts.find((contact) => contact.id === contactId);
          return contact ? { value: contact.id, label: contact.name } : null;
        })
        .filter(Boolean) // Eliminar los valores null de la lista de contactos no existentes
    : [];

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-5">
          {/* Encabezado */}
          <div className="mb-4">
            <h2 className="text-2xl font-light text-gray-800">Editar Tarea</h2>
            <p className="text-sm text-gray-500">Modifica los detalles de tu tarea</p>
          </div>

          {/* Formulario */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Título</label>
              <input
                type="text"
                value={selectedTask.title}
                onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Descripción</label>
              <textarea
                value={selectedTask.description}
                onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none resize-none"
                rows="2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Fecha</label>
              <input
                type="date"
                value={formattedDate}
                onChange={(e) => setSelectedTask({ ...selectedTask, due_date: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
              />
            </div>

            {/* Selector de contactos asignados */}
            <div>
              <label htmlFor="contact" className="text-xs font-medium text-gray-700 block mb-1">
                Asignar a Contactos
              </label>
              <Select
                id="contact"
                isMulti // Permite seleccionar múltiples contactos
                options={contactOptions}
                value={selectedContacts}
                onChange={handleContactChange} // Actualiza los contactos seleccionados
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Selecciona contactos"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={async () => {
                await handleTaskUpdate(selectedTask);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium text-sm"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
