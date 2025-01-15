// services/userService.js
import api from './api';

export const getUser = async () => {
  try {
    const response = await api.get('/user'); // La ruta de tu API para obtener el usuario
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los datos del usuario: ' + error.message);
  }
};
