<template>
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
      <input v-model="password" type="password" id="password" name="password" 
      class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" 
      required>
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
    import {ref} from 'vue';
    import { useRouter } from "vue-router";
    import {signUpWithEmail} from '../../../services/supabaseClient.ts'

    interface AuthResponse {
      data: any | null;
      error: Error | null;
    }

    const router = useRouter();

    const email = ref<string>('');
    const password = ref<string>('');
    const authError = ref<string | null>(null);
    
    function submitForm(){
      onSignUp();
    }

    const onSignUp = async() =>{
    const response: AuthResponse = await signUpWithEmail(email.value, password.value);
    if (response.error) {
        authError.value = response.error.message;
    }else{
        // localStorage.setItem('user',response.data?.user);
        // localStorage.setItem('userId',response.data?.user.email);
        // //user.value = response.data?.user;
        authError.value = null;
        const lastPath = localStorage.getItem('lastPath') ?? '/dashboard';
        router.replace(lastPath);
      }
    }

</script>