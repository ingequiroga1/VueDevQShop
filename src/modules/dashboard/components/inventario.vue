<template>
  <div class="container mx-auto p-4 bg-white rounded-lg shadow">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold">Gestión de Inventario</h2>
      <button
        @click="showAddForm = true"
        class="bg-primary-color text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Agregar Producto
      </button>
    </div>
    <div class="mb-4">
    <!-- Campo de búsqueda -->
    <input 
      v-model="searchQuery" 
      placeholder="Buscar por nombre..."
      class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300" 
    />
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
          <tr
            v-for="product in products"
            :key="product.producto_id"
            class="hover:bg-gray-50 text-sm"
          >
            <td class="px-4 py-2">{{ product.nombre }}</td>
            <td class="px-4 py-2">{{ product.categorias[0].nombre }}</td>
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
                @click="editProduct(product)"
                class="bg-primary-color text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                Editar
              </button>
              <button
                @click="confirmDelete(product.producto_id)"
                class="bg-secondary-color text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
       <!-- Controles de paginación -->
      <div class="flex items-center justify-center space-x-4 mt-4">
        <button @click="currentPage--; cambiarPagina()" 
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md 
           hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <span class="text-lg font-semibold text-gray-700">
          Página {{ currentPage }}
        </span>
        <button 
          @click="currentPage++; cambiarPagina()" 
          :disabled="currentPage * pageSize >= totalProducts"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md 
           hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    </div>

    <!-- Modal para agregar/editar producto -->
    <div
      v-if="showAddForm || editingProduct"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">
          {{ editingProduct ? "Editar" : "Agregar" }} Producto
        </h3>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Nombre:</label>
            <input
              v-model="productForm.nombre"
              type="text"
              required
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Categoría:</label>
            <select
              v-model="productForm.categorias.categoria_id"
              required
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="" disabled>Seleccione una categoría</option>
              <option 
                v-for="categoria in categorias" 
                :key="categoria.id" 
                :value="categoria.id"
              >
                {{ categoria.nombre }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Descripción:</label>
            <textarea
              v-model="productForm.descripcion"
              required
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Código de barras:</label>
            <input
              v-model="productForm.codigo_barras"
              required
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            ></input>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Stock:</label>
            <input
              v-model.number="productForm.stock"
              type="number"
              required
              min="0"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Precio:</label>
            <input
              v-model.number="productForm.precio_venta"
              type="number"
              required
              min="0"
              step="0.01"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">URL de Imagen:</label>
            <input
              v-model="productForm.image"
              type="text"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div class="flex justify-end gap-2">
            <button
              type="submit"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {{ editingProduct ? "Actualizar" : "Agregar" }}
            </button>
            <button
              type="button"
              @click="closeModal"
              class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-sm">
        <h3 class="text-lg font-semibold mb-4">Confirmar Eliminación</h3>
        <p class="text-sm mb-4">
          ¿Estás seguro de que deseas eliminar este producto?
        </p>
        <div class="flex justify-end gap-2">
          <button
            @click="deleteProduct"
            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Eliminar
          </button>
          <button
            @click="showDeleteConfirm = false"
            class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>

  </div>
</template>


<script setup>
import { ref, computed,watch } from 'vue'

defineProps({
  products: {
    type: Array,
    required: true
  },
  totalProducts: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update-product', 'add-product', 'delete-product','filtrar-product','cambiar-pagina'])

const showAddForm = ref(false)
const editingProduct = ref(null)
const showDeleteConfirm = ref(false)
const deleteProductId = ref(null)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 10



const categorias = ref([
      { id: 1, nombre: 'Refrescos' },
      { id: 2, nombre: 'Pan Dulce' },
      { id: 3, nombre: 'FARMACIA' },
      { id: 4, nombre: 'PANES' },
      { id: 5, nombre: 'GALLETAS' },
      { id: 6, nombre: 'BOTANAS' },
      { id: 7, nombre: 'PAPELERIA' },
      { id: 8, nombre: 'FERRETERIA' },
      { id: 9, nombre: 'ACCS. CELULARES' },
      { id: 10, nombre: 'ABARROTE' },
      { id: 11, nombre: 'DULCERIA' },
      { id: 12, nombre: 'AGUA' },
      { id: 13, nombre: 'ALIMENTO PARA MASCOTAS' },
      { id: 14, nombre: 'LACTEOS' },
      { id: 15, nombre: 'EMBUTIDOS' },
      { id: 16, nombre: 'BEBIDAS' },
      { id: 17, nombre: 'FORMULAS LACTEAS' },
      { id: 18, nombre: 'ALIMENTOS' },
      { id: 19, nombre: 'SIN CATEGORIA' }
])

const productForm = ref({
  nombre: '',
  categorias: {},
  descripcion: '',
  codigo_barras: '',
  stock: 0,
  precio_venta: 0,
})

// const calculateMargin = (product) => {
//   return (((product.price - product.cost) / product.price) * 100).toFixed(1)
// }

const editProduct = (product) => {
  editingProduct.value = product
  productForm.value = { ...product }
  showAddForm.value = true
}

const closeModal = () => {
  showAddForm.value = false
  editingProduct.value = null
  productForm.value = {
    nombre: '',
  categorias: {},
  descripcion: '',
  codigo_barras: '',
  stock: 0,
  precio_venta: 0,
  }
}

const handleSubmit = () => {
  if (editingProduct.value) {
    emit('update-product', {
      ...editingProduct.value,
      ...productForm.value
    })
  } else {
    emit('add-product', { ...productForm.value })
  }
  closeModal()
}

const confirmDelete = (productId) => {
  deleteProductId.value = productId
  showDeleteConfirm.value = true
}

const deleteProduct = () => {
  emit('delete-product', deleteProductId.value)
  showDeleteConfirm.value = false
  deleteProductId.value = null
}

const cambiarPagina = () => {
  emit('cambiar-pagina', currentPage.value)
}

watch(searchQuery, (newValue) => {
    currentPage.value = 1 //Reset page when search query changes
    emit('filtrar-product', newValue)
});


</script>

