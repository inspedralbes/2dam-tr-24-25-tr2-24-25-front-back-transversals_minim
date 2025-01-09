import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    user: {
      username: '',
      email: '',
      permission: null, // Cambiado a null para manejar mejor los casos indefinidos
    },
    token: '',
  }),
  actions: {
    setUser(newUsername, newEmail, newPermission) {
      console.log('SetUser llamado con:', { newUsername, newEmail, newPermission });
      this.user.username = newUsername;
      this.user.email = newEmail;
      this.user.permission = newPermission;
      console.log('Estado del usuario después de setUser:', this.user);
    },
    setToken(newToken) {
      this.token = newToken;
    },
  },
  getters: {
    isAdmin: (state) => state.user.permission === 'admin', 
    isLoggedIn: (state) => !!state.token,
  },
});
