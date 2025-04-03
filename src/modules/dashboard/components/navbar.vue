<template>
  <header class="flex items-center h-14 px-4 border-b border-gray-300 sm:h-16 md:px-6 lg:px-8">
    <div class="flex items-center justify-between w-full">
      <!-- Logo -->
      <a class="flex items-center gap-2 font-semibold" href="#">
        <img alt="Vue logo" class="logo" src="../../../assets/vue.svg" width="40" height="40" />
      </a>

      <!-- Botón hamburguesa -->
      <button
        class="sm:hidden text-gray-700 hover:text-gray-900 focus:outline-none"
        @click="isMenuOpen = !isMenuOpen"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      <!-- Navegación -->
      <nav class="hidden sm:flex ml-auto space-x-4 items-center h-10 sm:space-x-6">
        <RouterLink :to="{ name: 'home' }"> Home </RouterLink>
        <RouterLink :to="{ name: 'ventas' }"> Ventas </RouterLink>
        <RouterLink :to="{ name: 'inventario' }"> Inventario </RouterLink>
        <RouterLink :to="{ name: 'pedidos' }"> Pedidos </RouterLink>
        <RouterLink to="#"> Reportes </RouterLink>
        <div class="flex items-center">
          <button
            class="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600"
            @click="logout"
            type="button"
          >
            SignOut
          </button>
        </div>
      </nav>
    </div>

     <!-- Menú desplegable móvil con transición -->
     <transition
      name="menu-transition"
      enter-active-class="transform transition duration-300 ease-in-out"
      leave-active-class="transform transition duration-300 ease-in-out"
      enter-from-class="-translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-full opacity-0"
    >
      <nav
        v-show="isMenuOpen"
        class="sm:hidden absolute top-14 left-0 w-full bg-white shadow-md py-2 space-y-2"
      >
        <RouterLink class="block px-4 py-2 text-gray-700 hover:bg-gray-200" :to="{ name: 'home' }">Home</RouterLink>
        <RouterLink class="block px-4 py-2 text-gray-700 hover:bg-gray-200" :to="{ name: 'ventas' }">Ventas</RouterLink>
        <RouterLink class="block px-4 py-2 text-gray-700 hover:bg-gray-200" :to="{ name: 'inventario' }">Inventario</RouterLink>
        <RouterLink class="block px-4 py-2 text-gray-700 hover:bg-gray-200" :to="{ name: 'pedidos' }">Pedidos</RouterLink>
        <RouterLink class="block px-4 py-2 text-gray-700 hover:bg-gray-200" to="#">Reportes</RouterLink>
        <button
          class="block w-full text-left px-4 py-2 text-white bg-red-500 rounded-md text-sm font-medium hover:bg-red-600"
          @click="logout"
          type="button"
        >
          SignOut
        </button>
      </nav>
    </transition>
  </header>
</template>
<script setup lang="ts">

import { ref } from "vue";
import {  signOut } from "../../../services/auth/authService.ts";

const logout = async() =>{
  const error = signOut();
  if (!error) {
    console.log('Sesión cerrada');
    
  }
}

const isMenuOpen = ref(false);

</script>

<style scoped>
.logo {
  display: block;
}


/* Transiciones del menú */
.menu-transition-enter-active,
.menu-transition-leave-active {
  transition: all 0.3s ease-in-out;
}
.menu-transition-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}
.menu-transition-enter-to {
  transform: translateY(0);
  opacity: 1;
}
.menu-transition-leave-from {
  transform: translateY(0);
  opacity: 1;
}
.menu-transition-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

</style>

