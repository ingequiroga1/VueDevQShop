<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
      <h2 class="text-lg font-bold mb-2">{{ titulo }}</h2>
      <p class="text-gray-700 mb-6">{{ mensaje }}</p>
      <div class="flex justify-end gap-2">
        <button
          class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          @click="$emit('cancelar')"
        >
          Cancelar
        </button>
        <button
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          @click="$emit('confirmar')"
        >
          {{ textoConfirmar }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  titulo: {
    type: String,
    default: '¿Estás seguro?'
  },
  mensaje: {
    type: String,
    default: 'Esta acción no se puede deshacer.'
  },
  textoConfirmar: {
    type: String,
    default: 'Eliminar'
  }
})

defineEmits(['confirmar', 'cancelar'])
</script>
