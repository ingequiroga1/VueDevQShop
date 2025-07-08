<template>
    <div class="change-password">
      <h2>Cambiar Contraseña</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <input
            id="password"
            type="password"
            v-model="password"
            placeholder="Nueva contraseña"
            required
          />
        </div>
  
        <div class="form-group">
          <input
            id="confirmPassword"
            type="password"
            v-model="confirmPassword"
            placeholder="Confirmar Contraseña"
            required
          />
        </div>
  
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <button type="submit" :disabled="isSubmitting">Cambiar Contraseña</button>
      </form>
    </div>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import { updateUser } from '../../../services/auth/authService';
import { AuthResponse } from '../../../interfaces/Auth';
import { useRouter } from 'vue-router';

    const password = ref('');
    const confirmPassword = ref('');
    const errorMessage = ref('');
    const isSubmitting = ref(false);
    const router = useRouter();
    

     const handleSubmit = async () => {
        errorMessage.value = '';
        // Validate that passwords match
        if (password.value !== confirmPassword.value) {
          errorMessage.value = 'La contraseña no es igual.';
          return;
        }
        isSubmitting.value = true;
        
        const response:AuthResponse = await updateUser(password.value);
         if (response.error) {
             errorMessage.value = response.error.message;
         }
         else{
             router.replace("/changepass");
         }     
         isSubmitting.value = false;               
      };
</script>

 
<style scoped>
  .change-password {
    max-width: 400px;
    margin: 0 auto;
    padding: 1em;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    text-align: center;
  }
  
  .form-group {
    margin-bottom: 1em;
  }
  
  label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5em;
  }
  
  input {
    width: 100%;
    padding: 0.5em;
    border: 1px solid #ccc;
    border-radius: 3px;
  }
  
  button {
    width: 100%;
    padding: 0.75em;
    border: none;
    background-color: #007bff;
    color: white;
    font-size: 1em;
    border-radius: 3px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  button:hover:not(:disabled) {
    background-color: #0056b3;
  }
  
  .error {
    color: red;
    font-size: 0.875em;
    margin-top: -0.5em;
    margin-bottom: 1em;
  }
</style>
