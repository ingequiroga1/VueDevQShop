<template>
  <div class="container mx-auto p-4 max-w-4xl bg-white border rounded-lg shadow-sm">
    <h2 class="text-lg font-semibold text-gray-800 mb-4">🔍 Filtros de búsqueda</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Fecha Inicio -->
      <div>
        <label for="start-date" class="block text-sm font-medium text-gray-700 mb-1">
          Fecha Inicio
        </label>
        <input
          v-model="startDate"
          id="start-date"
          type="date"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
        />
      </div>

      <!-- Fecha Fin -->
      <div>
        <label for="end-date" class="block text-sm font-medium text-gray-700 mb-1">
          Fecha Fin
        </label>
        <input
          v-model="endDate"
          id="end-date"
          type="date"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
        />
      </div>

      <!-- Botón Buscar -->
      <div class="flex items-end">
        <button
          @click="emitSearch"
          class="flex items-center justify-center gap-2 w-full md:w-auto bg-primary-color text-white font-semibold py-2 px-4 rounded-lg hover:bg-secondary-color transition"
        > 
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M21 21l-4.35-4.35m1.18-5.32a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" />
          </svg>
          Buscar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const today = new Date().toLocaleDateString('es-MX');

const startDate = ref(today);
const endDate = ref(today);

function emitSearch() {
    if (startDate.value && endDate.value) {
        emit('search', { startDate: startDate.value, endDate: endDate.value });
    }
    else {
        alert('por favor, selecciona ambas fechas.');
    }
}

const emit = defineEmits(['search']);
</script>

<style scoped></style>