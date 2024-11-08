<template>
      <!-- Container principal -->
  <div class="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
    <!-- Icono de verificación -->
    <div class="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
      <svg class="w-8 h-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    
    <!-- Título y mensaje -->
    <h2 class="text-2xl font-semibold text-gray-800 mb-2">¡Correo Confirmado!</h2>
    <p class="text-gray-600 mb-6">Gracias por confirmar tu correo electrónico. Ahora puedes acceder a todas nuestras funcionalidades.</p>
    
    <!-- Botón de acción -->
    <RouterLink :to="{name: 'login'}" class="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300">
      Ir al Inicio
    </RouterLink>
  </div>
</template>


