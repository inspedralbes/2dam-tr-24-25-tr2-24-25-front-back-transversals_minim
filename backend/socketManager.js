// socketManager.js
export const socketManager = (io) => {
    io.on('connection', (socket) => {
      console.log(`Usuario conectado: ${socket.id}`);
  
      // Escuchar eventos
      socket.on('mensaje', (data) => {
        console.log(`Mensaje recibido: ${data}`);
        // Enviar una respuesta a todos los clientes conectados
        io.emit('respuesta', `Servidor recibió: ${data}`);
      });
  
      socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${socket.id}`);
      });
    });
  };
  