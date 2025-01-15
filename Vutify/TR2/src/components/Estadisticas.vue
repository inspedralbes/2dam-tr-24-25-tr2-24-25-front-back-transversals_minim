<template>
  <v-container fluid class="background-container pa-0">
    <v-row no-gutters align="center" justify="center">
      <v-col cols="12" class="text-center mb-6">
        <h1 class="white--text text-h2 font-weight-bold"> Estadístiques</h1>
      </v-col>
    </v-row>

    <v-row no-gutters align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" class="d-flex justify-center">
        <v-img
          :src="imageUrl"
          alt="Imagen de estadísticas"
          class="rounded-lg imagen-estadisticas"
          max-height="600"
          width="100%"
          contain
        ></v-img>
      </v-col>
    </v-row>

    <!-- Formulario de fecha -->
    <v-row no-gutters align="center" justify="center">
      <v-col cols="12" sm="6" md="4">
        <v-form @submit.prevent="enviarDatos">
          <v-row>
            <v-col cols="4">
              <v-text-field
                label="Mes"
                v-model.number="month"
                type="number"
                min="1"
                max="12"
                required
                :rules="[validateMonth]"
                maxlength="2"
                @input="limitMonthInput"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="Año"
                v-model.number="year"
                type="number"
                :min="1900"
                :max="currentYear"
                required
                :rules="[validateYear]"
                maxlength="4"
                @input="limitYearInput"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Checkbox para lastWeek -->
          <v-checkbox
            v-model="lastWeek"
            label="¿Obtener estadísticas de la última semana?"
            class="mt-3"
          ></v-checkbox>

          <v-btn type="submit" color="primary" class="mt-4">
            Obtenir Estadístiques
          </v-btn>
        </v-form>
      </v-col>
    </v-row>

    <v-btn @click="Atras">
      Tornar Enrere
    </v-btn>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAppStore } from '@/stores/app';
import communicationManager from '@/services/communicationManager'; 
import router from '@/router';

const day = ref('');
const month = ref('');
const year = ref('');
const currentYear = new Date().getFullYear(); 
const imageName = ref('');
const imageUrl = computed(() => imageName.value ? `http://catch-the-math.dam.inspedralbes.cat:29876/graph-images/${imageName.value}.png` : '');
const lastWeek = ref(false); // Nuevo estado para el checkbox

const maxDia = computed(() => {
  if (month.value && year.value) {
    const date = new Date(year.value, month.value, 0); 
    return date.getDate(); 
  }
  return 31; 
});

const validateDay = (value) => value >= 1 && value <= maxDia.value || 'Día inválido';
const validateMonth = (value) => value >= 1 && value <= 12 || 'Mes inválido';
const validateYear = (value) => value >= 1900 && value <= currentYear || 'Año inválido';

const enviarDatos = async () => {
  try {
    
    let bodyRequest = {
      month: month.value || undefined,
      year: year.value || undefined,
      lastWeek: lastWeek.value // Agregar el valor del checkbox aquí
    };

    // Llama a la función obtenerEstadisticas con los valores del formulario
    const response = await communicationManager.obtenerEstadisticas(bodyRequest);
    
    // Asigna el nombre de la imagen recibida a la variable imageName
    imageName.value = response.imageName; 
    console.log(imageName);
  } catch (error) {
    console.error('Error al obtener las estadísticas:', error);
  }
};

// Función para volver a la página anterior
const Atras = () => {
  router.go(-1);
};
</script>

<style scoped>
.background-container {
  background-color: #7B4D91;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.imagen-estadisticas {
  width: 100%;
  max-height: 600px; /* Altura máxima para evitar distorsión */
  object-fit: contain; /* Mantiene la relación de aspecto de la imagen */
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
