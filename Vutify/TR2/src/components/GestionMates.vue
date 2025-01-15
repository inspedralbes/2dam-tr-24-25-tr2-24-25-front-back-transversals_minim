<template>
  <div class="gestion-roles-container">
    <v-card class="gestion-roles-card mx-auto" max-width="1000">
      <v-card-title class="headline text-center text-primary">
        Gestión de Roles de Usuarios
      </v-card-title>

      <!-- Filtros -->
      <v-row class="justify-center mb-6">
        <v-col cols="12" sm="6" md="4" lg="3">
          <v-select
            v-model="filtroRol"
            :items="['Todos', 'Administrador', 'Profesor', 'Alumno']"
            label="Filtrar por rol"
            dense
            outlined
            color="primary"
            class="text-white"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="4" lg="3">
          <v-text-field
            v-model="busqueda"
            label="Buscar por nombre"
            dense
            outlined
            append-icon="mdi-magnify"
            color="primary"
            class="text-white"
          ></v-text-field>
        </v-col>
      </v-row>

      <!-- Tabla de usuarios -->
      <v-progress-circular
        v-if="cargando"
        indeterminate
        color="primary"
        class="d-flex mx-auto my-6"
      ></v-progress-circular>

      <v-simple-table v-if="isAdmin && usuariosFiltrados.length > 0">
        <template v-slot:default>
          <thead>
            <tr class="table-header">
              <th class="text-start px-6 py-4">Nombre</th>
              <th class="text-start px-6 py-4">Email</th>
              <th class="text-center px-6 py-4">Rol</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="usuario in usuariosFiltrados"
              :key="usuario.id"
              class="hover-row"
            >
              <td class="px-6 py-4">{{ usuario.username }}</td>
              <td class="px-6 py-4">{{ usuario.email }}</td>
              <td class="text-center px-6 py-4">
                <v-chip-group
                  v-model="usuario.permission_type_id"
                  column
                  mandatory
                  class="d-flex justify-center"
                  active-class="chip-active"
                >
                  <v-chip
                    v-for="role in rolesDisponibles"
                    :key="role.value"
                    :value="role.value"
                    @click="cambiarPermiso(usuario.id, role.value)"
                    outlined
                    color="primary"
                    class="chip-styled"
                  >
                    {{ role.text }}
                  </v-chip>
                </v-chip-group>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

      <!-- Mensaje sin datos -->
      <v-alert
        v-else-if="!cargando"
        type="info"
        text
        class="my-6 text-center text-white"
      >
        No hay usuarios disponibles.
        <v-btn @click="initialize" color="primary" text>Reiniciar</v-btn>
      </v-alert>

      <!-- Mensaje de error -->
      <v-alert
        v-if="errorMessage"
        type="error"
        text
        class="my-6 text-center text-white"
      >
        {{ errorMessage }}
      </v-alert>

      <!-- Mensaje para no administradores -->
      <v-alert
        v-if="!isAdmin && !cargando"
        type="warning"
        text
        class="my-6 text-center text-white"
      >
        No tienes permisos para gestionar roles de usuarios.
      </v-alert>
    </v-card>
  </div>
  <button @click="VolverAtras" class="back-button">Volver atrás</button>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app';
import { storeToRefs } from 'pinia';
import communicationManager from '@/services/communicationManager';

const pinia = useAppStore();
const { user } = storeToRefs(pinia);
const router = useRouter();

const filtroRol = ref('Todos');
const busqueda = ref('');
const cargando = ref(false);
const usuarios = ref([]);
const errorMessage = ref('');

const rolesDisponibles = [
  { text: 'Administrador', value: 1 },
  { text: 'Profesor', value: 2 },
  { text: 'Alumno', value: 3 },
];

const permissionMap = {
  1: { text: 'Administrador', value: 1 },
  2: { text: 'Profesor', value: 2 },
  3: { text: 'Alumno', value: 3 },
};

const isAdmin = computed(() => pinia.user?.permission === 'admin');

const usuariosFiltrados = computed(() => {
  if (!usuarios.value || usuarios.value.length === 0) {
    return [];
  }

  let filtrados = usuarios.value;

  if (filtroRol.value !== 'Todos') {
    const rolValue = rolesDisponibles.find(r => r.text === filtroRol.value)?.value;
    filtrados = filtrados.filter((usuario) => permissionMap[usuario.permission_type_id]?.value === rolValue);
  }

  if (busqueda.value) {
    filtrados = filtrados.filter((usuario) =>
      usuario.username.toLowerCase().includes(busqueda.value.toLowerCase())
    );
  }

  return filtrados;
});

const initialize = async () => {
  cargando.value = true;
  try {
    const response = await communicationManager.getUser();
    if (!response.ok) throw new Error('Error al cargar usuarios');
    const data = await response.json();
    if (Array.isArray(data)) {
      usuarios.value = data.map(usuario => ({
        ...usuario,
        permission_type_id: usuario.permission_type_id || 3,
        permission: permissionMap[usuario.permission_type_id || 3]?.text || 'Desconocido'
      }));
    } else {
      throw new Error('Formato de datos inesperado');
    }
  } catch (error) {
    console.error('Error:', error);
    errorMessage.value = error.message;
  } finally {
    cargando.value = false;
  }
};

const cambiarPermiso = async (userId, nuevoRol) => {
  try {
    const permissionTypeId = Number(nuevoRol);

    const response = await communicationManager.modifyPermission(userId, permissionTypeId);
    if (response.ok) {
      const userIndex = usuarios.value.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        usuarios.value[userIndex].permission_type_id = permissionTypeId;
        usuarios.value[userIndex].permission =
          permissionMap[permissionTypeId]?.text || "";
      }
    } else {
      errorMessage.value = "Error al modificar el permiso";
    }
  } catch (error) {
    errorMessage.value = "Error en la petición: " + error.message;
  }
};

const VolverAtras = async () => {
  router.push('/main');
}

onMounted(() => {
  const pinia = useAppStore();
  if (pinia.token === '') {
    router.push("/");
  }
  initialize();
});
</script>

<style scoped>
.gestion-roles-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #121212;
  padding: 20px;
}

.gestion-roles-card {
  border-radius: 8px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  background: #1e1e1e;
  color: white;
}

.table-header {
  background-color: #1976d2;
  color: white;
  font-size: 1.2rem;
  padding: 12px;
}

.text-large {
  font-size: 1.2rem;
}

.hover-row:hover {
  background-color: #292929;
  transition: background-color 0.3s;
}

.chip-styled {
  margin: 8px;
  font-size: 1rem;
  font-weight: bold;
}

.chip-active {
  background-color: #1976d2 !important;
  color: white !important;
}

.text-primary {
  color: #1976d2 !important;
}

.text-white {
  color: white !important;
}

.px-6 {
  padding-left: 24px;
  padding-right: 24px;
}

.py-4 {
  padding-top: 16px;
  padding-bottom: 16px;
}

.mb-6 {
  margin-bottom: 24px;
}

.my-6 {
  margin-top: 24px;
  margin-bottom: 24px;
}

.back-button {
  position: fixed;
  bottom: 20px;
  left: 20px; 
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
}

.back-button:hover {
  background-color: #1565c0;
}
</style>
