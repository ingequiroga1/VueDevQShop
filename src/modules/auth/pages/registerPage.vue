<template>
  <Alert 
    v-if="showAlert" 
    :type="alertType" 
    :message="alertMessage" 
    dismissible 
    @close="showAlert = false"
  />
    <h1 class="text-2xl font-semibold mb-4">Registrarse</h1>
  <form @submit.prevent="submitForm">
    <!-- Name Input -->
    <div class="mb-4">
      <label for="name" class="block text-gray-600">Nombre</label>
      <input type="text" id="name" name="name" 
      class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
      required
      />
    </div>
    <!-- Username Input -->
    <div class="mb-4">
      <label for="username" class="block text-gray-600">Email</label>
      <input v-model="email" type="email" id="username" name="username" 
      class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" 
      required>
    </div>
    <!-- Password Input -->
    <div class="mb-4">
      <label for="password" class="block text-gray-600">Contraseña</label>
      <input v-model="password" :type="passFieldType" id="password" name="password" 
      class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" 
      required>
    </div>
    <div class="mb-4 flex items-center">
          <input type="checkbox" id="showPass" 
          name="showPass" 
          class="text-blue-500"
          @change="togglePaswordVisibility" />
          <label for="showPass" class="text-gray-600 ml-2">Mostrar Contraseña</label>
   </div>
    <!-- Login Button -->
    <button 
    type="submit" 
    class="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full">Registrarse</button>
  </form>

   <!-- Sign up  Link -->
   <div class="mt-6 text-blue-500 text-center">
    <RouterLink :to="{name: 'login'}" class="hover:underline">Login</RouterLink>
  </div>
</template>

<script setup lang="ts">
    import {ref,computed} from 'vue';
    import {signUpWithEmail} from '../../../services/auth/authService.ts'
    import Alert from '../../common/components/alertComponent.vue'

    interface AuthResponse {
      data: any | null;
      error: Error | null;
    }

    const email = ref<string>('');
    const password = ref<string>('');
    const authError = ref<string | null>(null);
    const showAlert =ref(false);
    const showPassword = ref(false);
    const alertMessage = ref<string>('');
    const alertType = ref<'success'|'error'|'warning'|'info'>('info');
    
    function submitForm(){
      onSignUp();
    }

    const passFieldType = computed(() => (showPassword.value ? 'text' : 'password'));

    function togglePaswordVisibility() {
      showPassword.value = !showPassword.value;
    }

    const onSignUp = async() =>{
    const response: AuthResponse = await signUpWithEmail(email.value, password.value);
    if (response.error) {
        //authError.value = response.error.message;
        alertType.value = 'error'
        showAlert.value = true
        alertMessage.value = response.error.message
        
      }else{
        authError.value = null;
        alertType.value = 'success'
        showAlert.value = true
        alertMessage.value = "¡Gracias por registrarte! Para completar el proceso de registro y activar tu cuenta, solo necesitas confirmar tu correo electrónico."
      }
    }

</script>