<template>
     <header class="flex items-center h-14 px-4 border-b border-gray-300 sm:h-16 md:px-6 lg:px-8">
      <div>
        <a class="flex items-center gap-2 font-semibold" href="#">
          <img alt="Vue logo" class="logo" src="../../../assets/vue.svg" width="40" height="40" />
        </a>
      </div>
      <nav class="ml-auto space-x-4 flex items-center h-10 sm:space-x-6">
        <RouterLink :to="{name: 'home'}"> Home </RouterLink>
        <RouterLink :to="{name: 'ventas'}"> Ventas </RouterLink>
        <RouterLink :to="{name: 'inventario'}"> Inventario </RouterLink>
        <RouterLink to="#"> Reportes </RouterLink>
        <button @click="logout" type="button">SignOut</button>
      </nav>
    </header>
</template>
<script setup lang="ts">
import {  signOut } from "../../../services/auth/authService.ts";

const logout = async() =>{
  const error = signOut();
  if (!error) {
    console.log('Sesión cerrada');
    
  }
}


</script>

