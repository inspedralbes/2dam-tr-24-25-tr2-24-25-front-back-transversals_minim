<template>
  <v-container 
    fluid 
    class="d-flex justify-center align-center login-container"
  >
    <v-card 
      class="pa-8 login-card" 
      max-width="520px" 
      elevation="16"
    >
      <v-img
        src="@/assets/images/PersonajeRojoActualiazdooo.png"
        alt="Logo"
        height="80"
        contain
        class="mb-6"
      ></v-img>
      <v-card-title class="text-center text-h3 primary--text font-weight-bold mb-2">
      Benvinguts
      </v-card-title>
      <v-card-subtitle class="text-center grey--text text-subtitle-1 mb-8">
      Inicia sessió per a accedir al teu compte
      </v-card-subtitle>
      <v-card-text>
        <v-form ref="form" v-model="valid" @submit.prevent="login" lazy-validation>
          <v-text-field 
            v-model="email" 
            label="Correo Electrónico" 
            :rules="[rules.required, rules.email]" 
            required 
            type="email" 
            outlined 
            clearable
            color="primary"
            dense
            class="mb-6"
            prepend-inner-icon="mdi-email"
          ></v-text-field>
          <v-text-field 
            v-model="password" 
            label="Contraseña" 
            :rules="[rules.required, rules.minLength]" 
            required 
            :type="showPassword ? 'text' : 'password'" 
            outlined 
            clearable
            color="primary"
            dense
            class="mb-6"
            prepend-inner-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
          ></v-text-field>

          <v-checkbox
            v-model="rememberMe"
            label="Recordarme"
            color="primary"
            class="mb-6"
          ></v-checkbox>

          <v-alert 
            v-if="errorMessage" 
            type="error" 
            class="mb-6" 
            border="left"
            elevation="2"
            colored-border
          >
            {{ errorMessage }}
          </v-alert>

          <v-btn 
            block 
            color="primary" 
            class="mb-4 rounded-pill text-h6 py-3" 
            :disabled="!valid" 
            type="submit"
            :loading="loading"
            elevation="3"
          >
            <v-icon left>mdi-login</v-icon>
            Iniciar Sessió
          </v-btn>
          <v-btn 
            block 
            color="secondary" 
            class="mb-4 rounded-pill text-h6 py-3" 
            @click="goToRegister" 
            elevation="2"
          >
            <v-icon left>mdi-account-plus</v-icon>
            No tens compte? Registra't
          </v-btn>
        </v-form>
        <v-btn
          text
          color="primary"
          class="mt-2"
          @click="forgotPassword"
        >
        Vas oblidar la teva contrasenya?
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app';
import communicationManager from '@/services/communicationManager';

const pinia = useAppStore();

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const valid = ref(false);
const router = useRouter();
const showPassword = ref(false);
const rememberMe = ref(false);
const loading = ref(false);

const rules = {
  required: (value) => !!value || 'Este campo es obligatorio',
  email: (value) => /.+@.+\..+/.test(value) || 'Introduce un correo electrónico válido',
  minLength: (value) => value.length || 'La contraseña debe tener al menos 8 caracteres',
};

onMounted(() => {
  const isAuthenticated = pinia.token !== '';
  if (isAuthenticated) {
    router.push('/main');
  }
});

const login = async () => {
  if (!valid.value) return;
  
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const response = await communicationManager.login(email.value, password.value);

    if (!response.ok) {
      throw new Error('Credenciales incorrectas');
    }

    const data = await response.json();

    pinia.setToken(data.token);
    pinia.setUser(data.userInfo.username, data.userInfo.email, data.permission);
    
    if (rememberMe.value) {
      localStorage.setItem('rememberMe', 'true');
      localStorage.setItem('email', email.value);
    } else {
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('email');
    }
    
    sessionStorage.setItem('isAuthenticated', 'true');
    router.push('/main');
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
};

const goToRegister = () => {
  router.push('/register');
};

const forgotPassword = () => {
  // Implementar lógica para recuperar contraseña
  console.log('Recuperar contraseña');
};
</script>

<style scoped>
.login-container {  
  background-color: #000000;
  min-height: 100vh;
  padding: 0;
  margin: 0;
}

.login-card {
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  background-color: #023092;
  backdrop-filter: blur(10px);
}

.primary--text {
  color: #90caf9 !important;
}

.grey--text {
  color: #b0bec5 !important;
}

.v-btn {
  text-transform: none;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.v-btn[color="primary"] {
  background: linear-gradient(45deg, #2196f3, #1976d2);
}

.v-btn[color="secondary"] {
  background: linear-gradient(45deg, #f44336, #d32f2f);
}

.v-alert {
  font-size: 16px;
  border-color: #ff6f61;
  color: #ff6f61;
  background: rgba(44, 44, 44, 0.8);
}

.v-text-field {
  font-size: 18px;
}

.v-text-field >>> input {
  color: white !important;
}

.v-text-field >>> label {
  font-size: 16px;
  color: #b0bec5 !important;
}

.v-card-title,
.v-card-subtitle {
  font-family: 'Roboto', sans-serif;
}

.v-card-title {
  font-size: 32px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.v-card-subtitle {
  font-size: 18px;
}

@media (max-width: 600px) {
  .login-card {
    width: 90%;
    padding: 16px !important;
  }
  
  .v-card-title {
    font-size: 24px;
  }
  
  .v-card-subtitle {
    font-size: 16px;
  }
}
</style>
