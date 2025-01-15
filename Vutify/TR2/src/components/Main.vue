<template>
  <div class="cosmic-background">
    <div class="overlay"></div>
    
    <v-btn
        @click="GestionMates"
        class="stats-btn2 stats-button"
        color="purple"
        icon="mdi-wrench"
        style="font-size: 30px; padding: 40px 40px; display: flex; align-items: center; justify-content: center;" 
        
      ></v-btn>

    <v-container fluid class="d-flex align-center justify-center" style="height: 100vh;">
      <v-card 
        class="game-card glass-morphism" 
        elevation="20"
        max-width="500"
        data-aos="zoom-in-up"
      >
        <!-- Imagen con efectos -->
        <v-img
          :src="imageSrc"
          alt="Juego Matemáticas"
          class="game-image"
          height="300"
        >
          <template #default>
            <div class="image-overlay">
              <v-btn @click="downloadImage" class="ma-2" color="indigo" icon>
                <v-icon>mdi-cloud-upload</v-icon>
              </v-btn>

            </div>
          </template>
        </v-img>

        <!-- Contenido de la tarjeta -->
        <v-card-text class="text-center py-4">
          <h2 
            class="text-h4 mb-2 neon-text" 
            data-aos="fade-up"
          >
            Catch  The  Math 
          </h2>
          <p 
            class="text-subtitle-2 text-medium-emphasis" 
            data-aos="fade-up" 
            data-aos-delay="200"
          >
          Resol equacions i atrapa la bandera!
          </p>
        </v-card-text>

        <!-- Botón de acción para Crear Sala -->
        <v-card-actions class="justify-center pb-4">
          <v-btn 
            color="primary" 
            rounded
            class="action-btn stylish-btn"
            @click="CrearSala"
            data-aos="zoom-in-up"
          >
            <v-icon left>mdi-flag-checkered</v-icon> 
            Atrapa la Bandera!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
    <v-btn 
      class="stats-btn stats-button"
      @click="showStats"
      style="font-size: 30px; padding: 40px 40px; display: flex; align-items: center; justify-content: center;" 
      icon="mdi-chart-bar"
        >
        </v-btn>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from "vue-router";
import imageSrc from "@/assets/images/imagen.png";
import { useAppStore } from '@/stores/app';
import AOS from 'aos';
import 'aos/dist/aos.css';

const router = useRouter();

const GestionMates = () => {
  router.push("/GestionMates");
};

const CrearSala = () => {
  router.push("/CrearSala");
};

const showStats = async () => {
      console.log('enseña Grafica');
      router.push('/Estadisticas');  
};

const downloadImage = () => {
  const link = document.createElement('a');
  link.href = imageSrc;
  link.download = 'MathGame.png';
  link.click();
};

onMounted(() => {
  const pinia = useAppStore();
  if (pinia.token === '') {
    router.push("/");
  }
  AOS.init({
    duration: 1500,  // Transición más lenta para efectos dramáticos
    once: true
  });
});
</script>

<style scoped>
.cosmic-background {
  background: #7B4D91;
  background-size: cover;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  animation: space-animation 60s infinite linear;
}

@keyframes space-animation {
  0% { background-position: 0 0; }
  100% { background-position: 100% 100%; }
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}

.glass-morphism {
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 30px !important;
  box-shadow: 0 0 15px rgba(255,255,255,0.5);
}

.game-card {
  transition: all 0.6s ease;
}

.game-card:hover {
  transform: translateY(-10px) scale(1.1);
  box-shadow: 0 10px 50px rgba(255, 255, 255, 0.6);
}

.neon-text {
  color: #ff0ff0;
  text-shadow: 0 0 30px rgba(255,255,255,0.8), 0 0 60px rgba(255,255,255,0.6);
}

.stats-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}
.stats-btn2 {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.stylish-btn {
  color: white;
  border-radius: 25px;
  padding: 15px 20px;
  font-weight: bold;
  box-shadow:
    -1px -1px rgba(255,255,255,.5),
    -2px -2px rgba(0,0,0,.5);
  transition: background-color .3s ease, transform .2s;
}

.stylish-btn:hover {
  background-color: #ff4c00;
  transform: scale(1.1) rotate(5deg);
  box-shadow:
    -1px -1px rgba(255,255,255,.7),
    -2px -2px rgba(0,0,0,.7);
}

.download-btn {
  background-color: #4caf50;
  color: white;
  border-radius: 25px;
  padding: 12px;
  font-weight: bold;
  transition: background-color .3s ease, transform .2s;
  box-shadow:
    -1px -1px rgba(255,255,255,.5),
    -2px -2px rgba(0,0,0,.5);
}

.download-btn:hover {
  background-color: #45a049;
  transform: scale(1.05) rotate(-3deg);
  box-shadow:
    -1px -1px rgba(255,255,255,.7),
    -2px -2px rgba(0,0,0,.7);
}

.gestion-mates-btn {
  background-color: #2196f3;
  color: white;
  border-radius: 25px;
  padding: 12px;
  font-weight: bold;
  transition: background-color .3s ease, transform .2s;
  box-shadow:
    -1px -1px rgba(255,255,255,.5),
    -2px -2px rgba(0,0,0,.5);
}

.gestion-mates-btn:hover {
  background-color: #1976d2;
  transform: scale(1.05) rotate(-3deg);
  box-shadow:
    -1px -1px rgba(255,255,255,.7),
    -2px -2px rgba(0,0,0,.7);
}

.image-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: flex-end;
}

@keyframes space-animation {
  0% { background-position: 0 0; }
  100% { background-position: 100% 100%; }
}
</style>