export default {
    post: async (url, data) => {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
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
  };
  