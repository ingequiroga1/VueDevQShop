<template>
      <!-- Container principal -->
  <div class="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
    <div v-if="esInvite">
      <!-- Icono de verificación -->
    <div class="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
      <svg class="w-8 h-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    
    <!-- Título y mensaje -->
    <h2 class="text-2xl font-semibold text-gray-800 mb-2">¡Correo Confirmado!</h2>
    <p class="text-gray-600 mb-6">Gracias por confirmar tu correo electrónico. Ahora puedes acceder a todas nuestras funcionalidades.</p>
    
    </div>

    <PassChangeComponent v-if="esRecovery" />
  </div>
  
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import PassChangeComponent from '../components/passChangeComponent.vue';
import { setSession } from '../../../services/auth/authService';
import { useRouter } from 'vue-router';

const esRecovery = ref(false);
const esInvite = ref(false);

const router = useRouter();

onMounted(async () => {
  validarAcceso();
}
)

const ingresar = async (token:string, refreshToken:string) => {
 const {error} = await setSession(token,refreshToken);
  if (error) {
      console.error('Error al iniciar sesión:', error);
      return;
    }
    // Aquí puedes manejar la respuesta de la API después de iniciar sesión
  
    // Redirigir a la página principal o a donde desees
    router.push('/home');
    // Aquí puedes guardar el token en el almacenamiento local o en Vuex, según tu implementación
    // localStorage.setItem('token', token);
    // localStorage.setItem('refreshToken', refreshToken);
    // console.log('Token guardado en el almacenamiento local');

};






const validarAcceso = async () => {
  const hash = window.location.hash;
  const cleanedHash = hash.startsWith('#/') ? hash.substring(2) : hash;
  const urlParams = new URLSearchParams(cleanedHash);
  const accessToken:string | null = urlParams.get('access_token');
  const refreshToken = urlParams.get('refresh_token');
  const type = urlParams.get('type')

  if (type) {
    switch (type) {
      case 'recovery':
        if (accessToken && refreshToken) {
          await ingresar(accessToken, refreshToken);
        }
        esRecovery.value = true;
        router.replace("/changepass");
        break;
    
      default:
        break;
    }
  }

  if (accessToken) {
    if (accessToken && refreshToken) {
          await ingresar(accessToken, refreshToken);
        }
  }
}

</script>


