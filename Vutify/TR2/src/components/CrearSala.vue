<template>
  <div class="space-background">
    <div class="stars"></div>
    <div class="twinkling"></div>
    <div class="clouds"></div>

    <v-container fluid class="d-flex align-center justify-center" style="height: 100vh; width: 100%;">
      <v-card 
        class="game-card space-glass" 
        elevation="20"
        max-width="1600px" 
        data-aos="zoom-in"
      >
        <div class="code-container d-flex justify-center align-center">
          <h1 class="code-text glow-text" data-aos="fade-down">{{ roomCode }}</h1>
        </div>

        <v-card-text class="text-center py-4">
          <div class="d-flex justify-space-around team-scores">
            <div class="team-score">
              <div class="character-container">
                <p class="score glow-text pulsing">{{ flagBearerB }}</p>
                <v-img
                  src="@/assets/images/BanderaVerde.png"
                  height="200" 
                  width="200" 
                  class="team-icon character-animation"
                  :class="{ 'accelerated-animation': flagBearerB !== 'Base' }"
                ></v-img>
              </div>
            </div>
            <div class="team-score">
              <div class="character-container">
                <p class="score glow-text pulsing">{{ flagBearerA }}</p>
                <v-img
                  src="@/assets/images/banderaRoja.png"
                  height="200" 
                  width="200" 
                  class="team-icon character-animation"
                  :class="{ 'accelerated-animation': flagBearerA !== 'Base' }"
                ></v-img>
              </div>
            </div>
          </div>
        </v-card-text>

        <v-card-text class="text-center py-4">
  <div class="d-flex justify-space-between align-center" style="gap: 100px;">
    <div class="team-container" style="width: 20%; margin-left: 50px;">
      <div class="character-section">
        <v-img
          src="@/assets/images/PersonajeVerde.png"
          height="200" 
          width="200" 
          class="team-icon character-animation"
          :class="{ 
            'winning-animation': teamAKills > teamBKills,
            'losing-animation': teamAKills < teamBKills
          }"
        ></v-img>
        <h3 class="team-name glow-text">Equip Verd</h3>
        <p class="score glow-text pulsing">{{ teamAKills }}</p>
      </div>
    </div>
    
    <div class="chart-container" style="width: 60%;">
      <canvas id="killsChart" width="800" height="400"></canvas>
    </div>
    
    <div class="team-container" style="width: 20%; margin-right: 50px;">
      <div class="character-section">
        <v-img
          src="@/assets/images/PersonajeRojoActualiazdooo.png"
          height="200" 
          width="200" 
          class="team-icon character-animation"
          :class="{ 
            'winning-animation': teamBKills > teamAKills,
            'losing-animation': teamBKills < teamAKills
          }"
        ></v-img>
        <h3 class="team-name glow-text">Equip Vermell</h3>
        <p class="score glow-text pulsing">{{ teamBKills }}</p>
      </div>
    </div>
  </div>
</v-card-text>

<!-- Mostrar el equipo ganador -->
<v-card-text v-if="ganador"  class="text-center py-4">
  <h2 class="glow-text winner-message">¡El ganador es: {{ ganador }}!</h2>
</v-card-text>
     
        <!-- Gráfico de muertes -->
        <v-card-text class="text-center py-4">
          <canvas id="killsChart" width="400" height="200"></canvas>
        </v-card-text>

      </v-card>
    </v-container>

    <!-- Botón para mostrar estadísticas -->
    <v-btn 
      icon 
      class="stats-btn"
      @click="showStats"
    >
      <v-icon>mdi-chart-bar</v-icon>
    </v-btn>
    <v-btn
        @click="goBack"
        class="stats-btn2 stats-button"
        color="purple"
        icon="mdi-wrench"
        style="font-size: 20px; padding: 30px 30px; display: flex; align-items: center; justify-content: center;" 
      ><v-icon left>mdi-rocket</v-icon></v-btn>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from "vue-router";
import { io } from 'socket.io-client';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Chart from 'chart.js/auto';
import communicationManager from '../services/communicationManager';
import { useAppStore } from '@/stores/app';

// Variables reactivas
const router = useRouter();
const roomCode = ref();
const ganador = ref();
const flagBearerA = ref('Base');
const flagBearerB = ref('Base');
const teamAKills = ref(0); 
const teamBKills = ref(0);

// Computed para determinar el equipo ganador
const winningTeam = computed(() => {
  if (teamAKills.value > teamBKills.value) return 'team-a';
  if (teamBKills.value > teamAKills.value) return 'team-b';
  return null; // Empate
});

// Conectar al servidor WebSocket
const socket = io('http://catch-the-math.dam.inspedralbes.cat:29876/'); 

// Crear el código de la sala
const CreateCode = async () => {
  try {
    const response = await communicationManager.getCode();
    if (!response.ok) {
      throw new Error('Error al generar el código de sala');
    }
    const data = await response.json();
    roomCode.value = data.code;
  } catch (error) {
    console.error('Error:', error.message);
  }
};

const showStats = async () => {
    console.log('enseña Grafica');
    router.push('/Estadisticas');  
};


// Regresar a la página anterior
const goBack = () => {
  router.push(`/main`);
};

// Crear el gráfico de muertes
let killsChart = null;

const createChart = () => {
  const ctx = document.getElementById('killsChart').getContext('2d');
  killsChart = new Chart(ctx, {
    type: 'bar',
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 800,
        easing: 'easeOutBounce',
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)',
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)',
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: 'rgba(255, 255, 255, 0.7)',
          }
        }
      }
    },
    data: {
      labels: ['Equipo A', 'Equipo B'],
      datasets: [{
        label: 'Kills',
        data: [teamAKills.value, teamBKills.value],
        backgroundColor: ['rgba(0, 255, 0, 0.6)', 'rgba(255, 0, 0, 0.6)'],
        borderColor: ['rgba(0, 255, 0, 1)', 'rgba(255, 0, 0, 1)'],
        borderWidth: 1
      }]
    }
  });
};


// Actualizar el gráfico cuando cambien las muertes
const updateChart = () => {
  if (killsChart) {
    killsChart.data.datasets[0].data = [teamAKills.value, teamBKills.value];
    killsChart.update();
  }
};

watch([teamAKills, teamBKills], updateChart);

onMounted(async () => {
  const pinia = useAppStore();
  if (pinia.token === '') {
    router.push("/");
  }
  AOS.init({
    duration: 1000,
    once: true
  });

  await CreateCode();
  nextTick(() => {
    createChart();
  });  

  socket.on('correct-answer-green', () => {
    teamAKills.value++;
  });
  socket.on('correct-answer-red', () => {
    teamBKills.value++;
  });

  socket.on('flag-red-taken', (data) => {
    console.log(data)
    flagBearerA.value = data; 
  });
  socket.on('flag-red-returned', (data) => {
    console.log(data)
    flagBearerA.value = 'Base'; 
  });


  socket.on('flag-green-taken', (data) => {
    console.log(data)
    flagBearerB.value = data; 
  });
  socket.on('flag-green-returned', (data) => {
    console.log(data)
    flagBearerB.value = 'Base'; 
  });

  socket.on('winner-team-red', () => {
    console.log('HOLAROJO')
  ganador.value = 'Equipo Rojo'; 
});

socket.on('winner-team-green', () => {
  console.log('HOLAVERDE')
  ganador.value = 'Equipo Verd';
});
});

onUnmounted(() => {
  socket.disconnect();
});
</script>



<style scoped>

.winner-message {
  font-size: 2.5rem;
  color: #FFD700; /* Color dorado para destacar */
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.8); /* Efecto de brillo */
}
/* Fondo y superposiciones */
.space-background {
  background: #7B4D91;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  animation: backgroundAnimation 10s ease-in-out infinite;
}
.accelerated-animation {
  animation-duration: 0.5s !important; /* Acelera la animación */
}

.team-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%;
}

.chart-container {
  width: 40%;
}

#killsChart {
  max-width: 90%;
  margin: 0 auto;
  display: block;
}

.winning-animation {
  animation-duration: 0.5s !important; /* Acelera la animación */
  animation: glow 2s ease-in-out infinite, float 2s ease-in-out infinite;
  transform: scale(1.5); /* Incrementar el tamaño */
  z-index: 10; /* Asegurarse de que el personaje destaque */
}

.losing-animation {
  opacity: 0.5; /* Hacer más tenue al perdedor */
  animation: float 5s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 255, 0, 0.8), 0 0 30px rgba(255, 255, 0, 0.6);
  }
  50% {
    box-shadow: 0 0 40px rgba(255, 255, 0, 1), 0 0 60px rgba(255, 255, 0, 0.8);
  }
}

.chart-card {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  height: 80vh;
  display: flex;
  flex-direction: column;
}

.chart-card .v-card-text {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

#killsChart {
  width: 100% !important;
  height: 100% !important;
}



/* Ajustes del contenedor */
.v-container {
  width: 100%;
  padding: 0;
  margin: 0;
}

/* Tarjeta */
.game-card {
  transition: all 0.4s ease;
  border-radius: 25px;
  background-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.5);
  max-width: 200vw;
  width: 70vw;
  height: 100vh;
}
.game-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.6);
}

/* Códigos de sala */
.code-container {
  height: 160px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
}

.code-text {
  font-size: 5.5rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 0 12px rgba(255, 255, 255, 0.6), 0 0 18px rgba(255, 255, 255, 0.8);
  letter-spacing: 15px;
  margin-bottom: 30px;
}

/* Ajustes de las banderas */
.flag-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
}

.flag-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.flag-image {
  max-height: 300px;
  width: auto;
}

.flag-bearer-text {
  font-size: 1.3rem;
  letter-spacing: 3px;
  margin-bottom: 10px;
}

/* Animaciones */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
}

.character-container {
  perspective: 900px;
  transform-style: preserve-3d;
}

.character-animation {
  animation: character-idle 3s ease-in-out infinite;
  transition: all 0.2s ease;
}

.character-animation:hover {
  animation: character-hover 1.5s ease-in-out infinite;
}

/* Brillo de texto */
.glow-text {
  text-shadow: 0 0 18px rgba(255, 255, 255, 0.8), 0 0 30px rgba(0, 255, 255, 0.6), 0 0 50px rgba(0, 255, 255, 0.4);
}

.stats-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.stats-btn:hover {
  background: rgba(255, 255, 255, 0.35);
}
.stats-btn2 {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.action-btn {
  position: fixed;    
  bottom: 10px;
}

.action-btn:hover {
  box-shadow: 0 14px 25px rgba(0, 0, 0, 0.5);
}

/* Puntuaciones */
.score {
  font-size: 3.5rem;
  font-weight: 700;
  color: #ff4500;
  text-shadow: 0 0 18px rgba(255, 69, 0, 0.7);
}

/* Efectos flotantes */
.floating {
  animation: float 4s ease-in-out infinite;
}

.pulsing {
  animation: pulse 1.8s ease-in-out infinite;
}

@keyframes character-idle {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-4px) rotate(-1deg);
  }
  50% {
    transform: translateY(0) rotate(0deg);
  }
  75% {
    transform: translateY(-4px) rotate(1deg);
  }
}

@keyframes character-hover {
  0%, 100% {
    transform: translateY(0) scale(1) rotate(0deg);
    filter: brightness(1.1);
  }
  50% {
    transform: translateY(-8px) scale(1.07) rotate(4deg);
    filter: brightness(1.4);
  }
}

.team-icon {
  max-height: 250px;
  width: auto;
  height: auto;
}

/* Mejora en el efecto de brillo del texto */
.glow-text {
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.8), 0 0 25px rgba(255, 255, 255, 0.5), 0 0 35px rgba(255, 255, 255, 0.3);
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}
</style>
