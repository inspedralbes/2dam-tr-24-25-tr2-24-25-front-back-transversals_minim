export default {
  post: async (url, data) => {
    try {
      const token = localStorage.getItem('token'); // Recuperar el token de localStorage
      const headers = {
        'Content-Type': 'application/json',
      };

      // Si el token está disponible, añadirlo a los encabezados
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Error en la solicitud');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      throw error;
    }
  },

  // Método para realizar solicitudes GET (si lo necesitas)
  get: async (url) => {
    try {
      const token = localStorage.getItem('token'); // Recuperar el token de localStorage
      const headers = {
        'Content-Type': 'application/json',
      };

      // Si el token está disponible, añadirlo a los encabezados
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Error en la solicitud');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      throw error;
    }
  },
};
