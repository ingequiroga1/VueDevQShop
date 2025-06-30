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
        
    <!-- Usuario (icono y menú desplegable) -->
    <div class="relative" @click="toggleMenu" v-if="principalStore.user">
      <img
        src="https://ui-avatars.com/api/?name=Juan+Quiroga&background=0D8ABC&color=fff"
        alt="Avatar"
        class="w-10 h-10 rounded-full cursor-pointer border-2 border-white shadow"
      />

      <!-- Menú desplegable -->
      <div
        v-if="menuAbierto"
        class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50"
      >
        <div class="px-4 py-2">
          <p class="text-sm font-semibold text-gray-800">{{ principalStore.user.nombre }}</p>
          <p class="text-xs text-gray-500">{{ principalStore.user.rol }}</p>
        </div>
        <hr class="my-1" />
        <button
          @click="logout"
          class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
        >
          Cerrar sesión
        </button>
      </div>
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
import { useprincipalStore } from '../../../store';


const logout = async() =>{
  const error = await signOut();
  console.log(error);
  if (!error) {
    window.location.href = '/login';
  } else {
    console.error('Error al cerrar sesión:', error);
  }

}

const isMenuOpen = ref(false);
const menuAbierto = ref(false);
const principalStore = useprincipalStore();

function toggleMenu() {
  menuAbierto.value = !menuAbierto.value
}

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

