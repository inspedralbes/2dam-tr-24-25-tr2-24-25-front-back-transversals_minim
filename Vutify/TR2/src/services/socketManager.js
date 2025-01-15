import { io } from 'socket.io-client';
import { useAppStore } from '@/stores/app';

const socket = io('http://catch-the-math.dam.inspedralbes.cat:29876');

export const initSocket = () => {
  const store = useAppStore();

  socket.on('connect', () => {
    console.log('Conectado al servidor de sockets');
  });

  socket.on('roleChanged', (data) => {
    console.log('Rol cambiado:', data);
    if (data.userId === store.user.id) {
      store.setUser(store.user.username, store.user.email, data.newRole);
    }
  });

  return socket;
};

export const emitRoleChange = (userId, newRole) => {
  socket.emit('changeRole', { userId, newRole });
};
