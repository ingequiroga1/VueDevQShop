<template>
  <Alert 
    v-if="showAlert" 
    :type="alertType" 
    :message="alertMessage" 
    dismissible 
    @close="showAlert = false"
  />
    <h1 class="text-2xl font-semibold mb-4">Login</h1>
      <form @submit.prevent="submitForm">
        <!-- Username Input -->
        <div class="mb-4">
          <label for="username" class="block text-gray-600">Email</label>
          <input v-model="email" type="email" id="username" name="username" 
          class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" 
          required
          />
        </div>
        <!-- Password Input -->
        <div class="mb-4">
          <label for="password" class="block text-gray-600">Contraseña</label>
          <input v-model="password" :type="passFieldType" id="password" name="password" 
          class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" 
          required
          />
        </div>
        <!-- Mostrar contraseña Checkbox -->
        <div class="mb-4 flex items-center">
          <input type="checkbox" id="showPass" 
          name="showPass" 
          class="text-blue-500"
          @change="togglePaswordVisibility" />
          <label for="showPass" class="text-gray-600 ml-2">Mostrar Contraseña</label>
        </div>
        <!-- Forgot Password Link -->
        <!-- <div class="mb-6 text-blue-500">
          <a href="#" class="hover:underline">Forgot Password?</a>
        </div> -->
        <!-- Login Button -->
        <button 
            type="submit" 
            class="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full">Login</button>
      </form>
      <!-- Sign up  Link -->
      <div class="mt-6 text-blue-500 text-center">
        <RouterLink :to="{name: 'register'}" class="hover:underline">Registrarse</RouterLink>
      </div>
    </template>



    <script lang="ts" setup>

    import { ref,computed } from 'vue';
    import { useRouter } from "vue-router";
    import {signInWithEmail} from '../../../services/auth/authService.ts'
    import Alert from '../../common/components/alertComponent.vue'

    //Definimos los tipos para el estado y la respuesta de autenticacion
    interface AuthResponse {
      data: any | null;
      error: Error | null;
    }
    
    const router = useRouter();
    
    const email = ref<string>('');
    const password = ref<string>('');
    const showPassword = ref(false);

    const showAlert =ref(false);
    const alertMessage = ref('');
    const alertType = ref<'success'|'error'|'warning'|'info'>('info');

    const passFieldType = computed(() => (showPassword.value ? 'text' : 'password'));

    function togglePaswordVisibility() {
      showPassword.value = !showPassword.value;
    }

   function submitForm(){
    onLogin();
   }

    const onLogin = async() =>{
      
      const response: AuthResponse = await signInWithEmail(email.value, password.value);
      if (response.error) {
        alertType.value = 'error';
        showAlert.value = true;
        alertMessage.value = response.error.message;
      }else{
        // localStorage.setItem('user',response.data?.user);
        // localStorage.setItem('userId',response.data?.user.email);
        // //user.value = response.data?.user;
        const lastPath = localStorage.getItem('lastPath') ?? '/dashboard';
        router.replace(lastPath);
      }
    };
    </script>