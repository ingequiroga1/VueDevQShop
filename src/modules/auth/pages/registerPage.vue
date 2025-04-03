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
      <input v-model="nombre" type="text" id="name" name="name" 
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
    import {signUpWithEmailUsuario,CheckIfUserExists} from '../../../services/auth/authService.ts'
    import Alert from '../../common/components/alertComponent.vue'
    import {AuthResponse} from '../../../interfaces/Auth.ts'



    const email = ref<string>('');
    const password = ref<string>('');
    const nombre = ref<string>('');
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
    const validacion: boolean = await CheckIfUserExists(email.value);
    if (!validacion) {
      const rolAdmin = 'Admin';
      const response: AuthResponse = await signUpWithEmailUsuario(email.value, password.value, nombre.value,rolAdmin);
      if (response.error) {
          alertType.value = 'error'
          showAlert.value = true
          alertMessage.value = response.error.message
          
        }else{
          authError.value = null;
          alertType.value = 'success'
          showAlert.value = true
          alertMessage.value = "¡Gracias por registrarte! Para completar el proceso de registro y activar tu cuenta, solo necesitas confirmar tu correo electrónico."
        }
    }else{
      alertType.value = 'warning'
          showAlert.value = true
          alertMessage.value = "Este correo electrónico ya está registrado. Si olvidaste tu contraseña, intenta restablecerla desde la opción ¿Olvidaste tu contraseña?"    
        }
    }

</script>