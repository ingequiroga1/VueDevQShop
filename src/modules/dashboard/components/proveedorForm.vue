<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
      <!-- Botón cerrar -->
      <button
        class="absolute top-2 right-2 text-gray-500 hover:text-red-600"
        @click="$emit('cerrar')"
      >
        ✕
      </button>

      <h2 class="text-xl font-semibold mb-4">
        {{ modo === 'editar' ? 'Editar proveedor' : 'Nuevo proveedor' }}
      </h2>

      <form @submit.prevent="guardarProveedor" class="space-y-4">
        <!-- Nombre -->
        <div>
          <label class="block text-gray-700 mb-1">*Nombre:</label>
          <input
            v-model="form.nombre"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <!-- Empresa -->
        <div>
          <label class="block text-gray-700 mb-1">*Empresa:</label>
          <input
            v-model="form.empresa"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <!-- Teléfono -->
        <div>
          <label class="block text-gray-700 mb-1">*Teléfono:</label>
          <input
            v-model="form.telefono"
            type="tel"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <!-- correo -->
        <div>
          <label class="block text-gray-700 mb-1">*Correo:</label>
          <input
            v-model="form.correo"
            type="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
          />
        </div>

         <!-- Direccion -->
        <div>
          <label class="block text-gray-700 mb-1">*Dirección:</label>
          <input
            v-model="form.direccion"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
          />
        </div>

         <!-- Notas -->
        <div>
          <label class="block text-gray-700 mb-1">Notas:</label>
          <input
            v-model="form.notas"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <!-- Botones -->
        <div class="flex justify-end gap-2 mt-4">
           <button
            type="button"
            @click="$emit('cerrar')"
            class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useprincipalStore } from '../../../store';
import { Proveedor } from '../../../interfaces/Proveedor';

const principalStore = useprincipalStore();

const props = defineProps<{
  proveedor: Proveedor,
  modo: string // 'crear' | 'editar'
}>()
const emit = defineEmits(['guardado', 'cerrar'])




const form = ref({...props.proveedor }) // Inicializa el formulario con los datos del proveedor si existen

watch(() => props.proveedor,nuevo => {
  form.value = { ...nuevo } // Actualiza el formulario si el proveedor cambia
})


const guardarProveedor = async () => {
 if (props.modo === 'editar') {
    console.log('Actualizando proveedor:', form.value);    
  } else {
    await principalStore.createProveedor(form.value)
  }

        emit('guardado') // Emite el evento de guardado con los datos del formulario
}

</script>
<style scoped>
.input {
  @apply w-full border rounded p-2;
}
</style>