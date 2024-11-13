const CONTACTS_API_URL = 'http://localhost:5000/api/contacts';

export const getContacts = async () => {
  try {
    const response = await fetch(CONTACTS_API_URL);
    if (!response.ok) throw new Error('Error al obtener contactos');
    return await response.json();
  } catch (error) {
    console.error('Error al obtener contactos:', error);
    throw error;
  }
};
