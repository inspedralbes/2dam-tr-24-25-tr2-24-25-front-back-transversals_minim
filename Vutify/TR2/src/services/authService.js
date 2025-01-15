// services/authService.js
import api from './ServiceApi'; // Importa el cliente axios configurado

export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password }); // Ajusta la URL de acuerdo a tu backend
    return response.data; // Devuelve los datos de la respuesta, incluyendo el token
  } catch (error) {
    throw new Error('Error al iniciar sesión: ' + error.message);
  }
};

export const register = async (name, email, password) => {
  try {
    const response = await api.post('/register', { name, email, password }); // Ajusta la URL de acuerdo a tu backend
    return response.data; // Devuelve los datos de la respuesta
  } catch (error) {
    throw new Error('Error al registrar usuario: ' + error.message);
  }
};
