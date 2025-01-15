<template>
  <v-container fluid class="d-flex justify-center align-center register-container">
    <v-card class="pa-8 register-card" width="100%" max-width="520" elevation="16">
      <v-img
        src="@/assets/images/PersonajeVerde.png"
        alt="Logo"
        height="80"
        contain
        class="mb-6"
      ></v-img>
      <v-card-title class="text-center text-h3 primary--text font-weight-bold mb-2">
        Crea el teu Compte
      </v-card-title>
      <v-card-subtitle class="text-center grey--text text-subtitle-1 mb-8">
      Uneix-te a la nostra comunitat
      </v-card-subtitle>
      <v-card-text>
        <v-form ref="form" v-model="valid" @submit.prevent="register" lazy-validation>
          <v-text-field 
            v-model="username" 
            label="Nombre Completo" 
            :rules="[rules.required]" 
            required 
            outlined 
            dense 
            clearable 
            class="mb-4"
            prepend-inner-icon="mdi-account"
          ></v-text-field>
          <v-text-field 
            v-model="email" 
            label="Correo Electrónico" 
            :rules="[rules.required, rules.email]" 
            required 
            type="email" 
            outlined 
            dense 
            clearable 
            class="mb-4"
            prepend-inner-icon="mdi-email"
          ></v-text-field>
          <v-text-field 
            v-model="password" 
            label="Contraseña" 
            :rules="[rules.required, rules.minLength(8), rules.passwordStrength]" 
            required 
            :type="showPassword ? 'text' : 'password'" 
            outlined 
            dense 
            clearable 
            class="mb-4"
            prepend-inner-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
          ></v-text-field>
          <v-text-field 
            v-model="confirmPassword" 
            label="Confirmar Contraseña" 
            :rules="[rules.required, rules.matchPassword]" 
            required 
            :type="showConfirmPassword ? 'text' : 'password'" 
            outlined 
            dense 
            clearable 
            class="mb-4"
            prepend-inner-icon="mdi-lock-check"
            :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showConfirmPassword = !showConfirmPassword"
          ></v-text-field>

          <v-checkbox
            v-model="agreeTerms"
            :rules="[rules.agreeTerms]"
            label="Acepto los términos y condiciones"
            required
            class="mb-4"
          ></v-checkbox>

          <v-alert v-if="errorMessage" type="error" class="mb-4" border="left" elevation="2" colored-border dismissible>
            {{ errorMessage }}
          </v-alert>

          <v-btn 
            block 
            color="primary" 
            class="mb-4 rounded-pill text-h6 py-3" 
            type="submit"
            :disabled="!valid || !agreeTerms"
            :loading="loading"
            elevation="3"
          >
            <v-icon left>mdi-account-plus</v-icon>
            Registrar-se
          </v-btn>
          <v-btn 
            block 
            color="secondary" 
            class="mb-4 rounded-pill text-h6 py-3" 
            @click="goToLogin" 
            elevation="2"
          >
            <v-icon left>mdi-login</v-icon>
            Ja tens compte? Inicia sessió
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { useAppStore } from '@/stores/app';
import { ref } from 'vue';
import communicationManager from '@/services/communicationManager';
import { useRouter } from 'vue-router';

const store = useAppStore();
const router = useRouter();
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const valid = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const agreeTerms = ref(false);
const loading = ref(false);

const rules = {
  required: (value) => !!value || 'Este campo es obligatorio',
  email: (value) => /.+@.+\..+/.test(value) || 'Introduce un correo electrónico válido',
  minLength: (length) => (value) => value.length >= length || `Debe tener al menos ${length} caracteres`,
  matchPassword: (value) => value === password.value || 'Las contraseñas no coinciden',
  passwordStrength: (value) => {
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    return (hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) || 'La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales';
  },
  agreeTerms: (value) => value || 'Debes aceptar los términos y condiciones para continuar',
};

const register = async () => {
  if (!valid.value) return;
  
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const response = await communicationManager.register(username.value, email.value, password.value);

    if (!response.ok) {
      throw new Error('Error al registrar el usuario');
    }
    
    // Simular un retraso para mostrar el loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Registro exitoso');
    router.push('/');
  } catch (error) {
    console.error('Error de registro:', error.message);
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
};

const goToLogin = () => {
  router.push('/');
};
</script>

<style scoped>
.register-container {
  background-color: #000000;
  min-height: 100vh;
  padding: 0;
  margin: 0;
}

.register-card {
  padding: 10px;  /* Reduce el padding */
  border-radius: 16px;  /* También puedes reducir el radio de borde para que se vea más pequeño */
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
  background: linear-gradient(45deg, #6a1b9a, #4a148c);
}

.v-btn[color="secondary"] {
  background: linear-gradient(45deg, #880e4f, #ad1457);
}

.v-alert {
  font-size: 16px;
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

.v-card-title {
  font-size: 32px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

.v-card-subtitle {
  font-size: 18px;
}

@media (max-width: 600px) {
  .register-card {
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
