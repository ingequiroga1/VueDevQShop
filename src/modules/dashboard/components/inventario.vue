<template>
  <div class="container mx-auto p-4 bg-white rounded-lg shadow">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold">Gestión de Inventario</h2>
      <button @click="$emit('add-producto')" class="bg-primary-color text-white px-4 py-2 rounded hover:bg-blue-700">
        + Agregar Producto
      </button>
    </div>
    <div class="mb-4">
      <!-- Campo de búsqueda -->
      <input v-model="searchQuery" placeholder="Buscar por nombre..."
        class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300" />
    </div>
    <!-- Tabla de inventario -->
    <div class="overflow-x-auto">
      <table class="w-full border-collapse text-left">
        <thead>
          <tr class="bg-gray-100 text-sm font-medium">
            <th class="px-4 py-2">Nombre</th>
            <th class="px-4 py-2">Categoría</th>
            <th class="px-4 py-2">Stock</th>
            <th class="px-4 py-2">Precio</th>
            <th class="px-4 py-2">Código de barras</th>
            <th class="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.producto_id" class="hover:bg-gray-50 text-sm">
            <td class="px-4 py-2">{{ product.nombre }}</td>
            <td class="px-4 py-2">{{ product.categorias.nombre }}</td>
            <td
              class="px-4 py-2 font-medium"
              :class="{ 'text-red-600': product.stock < 5 }"
            >
              {{ product.stock }}
            </td>
            <td class="px-4 py-2">${{ product.precio_venta.toFixed(2) }}</td>
            <td class="px-4 py-2">{{ product.codigo_barras }}</td>
            <td class="px-4 py-2 flex gap-2">
              <button
                @click="$emit('editar-producto',product)"
              >
                ✏️
              </button>
              <button
                @click="$emit('delete-producto', product.producto_id)"
              >
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Controles de paginación -->
      <div class="flex items-center justify-center space-x-4 mt-4">
        <button @click="currentPage--; cambiarPagina()" :disabled="currentPage === 1" class="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md 
           hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed">
          Anterior
        </button>
        <span class="text-lg font-semibold text-gray-700">
          Página {{ currentPage }}
        </span>
        <button @click="currentPage++; cambiarPagina()" :disabled="currentPage * pageSize >= totalProducts" class="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md 
           hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed">
          Siguiente
        </button>
      </div>
    </div>

  </div>
</template>


<script setup>
import { ref, computed, watch } from 'vue'
import { useprincipalStore } from '../../../store';


defineProps({
  products: {
    type: Array,
    required: true
  },
  totalProducts: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['editar-producto','filtrar-product',
'cambiar-pagina','add-producto','delete-producto']);

const showAddForm = ref(false)
const editingProduct = ref(null)
const showDeleteConfirm = ref(false)
const deleteProductId = ref(null)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 10




const cambiarPagina = () => {
  emit('cambiar-pagina', currentPage.value)
}

watch(searchQuery, (newValue) => {
  currentPage.value = 1 //Reset page when search query changes
  emit('filtrar-product', newValue)
});


</script>
