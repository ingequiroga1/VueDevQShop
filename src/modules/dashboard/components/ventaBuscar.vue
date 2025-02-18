<template>
    <div class="flex container gap-4 max-w-sm">
        <!-- <div>
            <input 
                type="date"
                id="start-date"
                v-model="startDate"
                class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm/6"
                placeholder="Fecha Inicio"
                />
        </div>
        <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"> 
              <input 
                type="date" 
                id="end-date" 
                v-model="endDate" 
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Fecha fin"
                />
            </div> -->
            <div class="max-w-md mx-auto">
                <label for="input-fecha" class="block text-sm font-medium text-gray-700 mb-2">
                Fecha Inicio
                </label>
                <input
                v-model="startDate"
                id="input-fecha"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
                />
            </div>
            <div class="max-w-md mx-auto">
                <label for="input-fecha" class="block text-sm font-medium text-gray-700 mb-2">
                Fecha fin
                </label>
                <input
                v-model="endDate" 
                id="input-fecha"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
                />
            </div>
    </div>
    <button 
            @click="emitSearch" 
            class="py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                >
             Buscar
        </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const today = new Date().toISOString().split('T')[0];

const startDate = ref(today);
const endDate = ref(today);

function emitSearch(){
    if (startDate.value && endDate.value) {
        emit('search',{startDate: startDate.value, endDate: endDate.value});
    }
    else{
        alert('por favor, selecciona ambas fechas.');
    }
}

const emit = defineEmits(['search']);
</script>

<style scoped>

</style>