<template>
    <div
    v-if="principalStore.showModalProductos"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        class="bg-white rounded-lg p-4 sm:p-6 w-[95%] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl overflow-y-auto max-h-[90vh] scroll-pb-32">
        <h3 class="text-lg font-semibold mb-4">
          {{ principalStore.editingProduct ? "Editar" : "Agregar" }} Producto
        </h3>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Nombre:</label>
            <input v-model="principalStore.editingProduct.nombre" type="text" required
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Categoría:</label>
            <select v-model="principalStore.editingProduct.categorias.categoria_id" required
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300">
              <option value="" disabled>Seleccione una categoría</option>
              <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
                {{ categoria.nombre }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Descripción:</label>
            <textarea v-model="principalStore.editingProduct.descripcion" required
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Código de barras:</label>
            <input v-model="principalStore.editingProduct.codigo_barras" required
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"></input>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Stock:</label>
            <input v-model.number="principalStore.editingProduct.stock" type="number" required min="0"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Precio:</label>
            <input v-model.number="principalStore.editingProduct.precio_venta" type="number" required min="0" step="0.01"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Proveedor:</label>
            <select v-model="principalStore.editingProduct.idproveedor"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300">
              <option value="" disabled>Seleccione un proveedor</option>
              <option v-for="proveedor in principalStore.proveedores" :key="proveedor.id" :value="proveedor.id">
                {{ proveedor.empresa }}
              </option>
            </select>
          </div>
          <!-- <div>
            <label class="block text-sm font-medium mb-1">URL de Imagen:</label>
            <input v-model="principalStore.editingProduct?.image" type="text"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300" />
          </div> -->

          <!-- Botones adaptados a pantallas pequeñas -->
          <div class="flex flex-col sm:flex-row sm:justify-end gap-2 mt-4">
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              {{ principalStore.editingProduct ? "Actualizar" : "Agregar" }}
            </button>
            <button type="button" @click="closeModal"
              class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
</template>

<script setup lang="ts"> 
import { ref } from 'vue';
import { useprincipalStore } from '../../../store';


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

const principalStore = useprincipalStore();

const handleSubmit = () => {
  if (principalStore.editingProduct) {
     principalStore.updateProducto()
     
  } 
//   else {
//     emit('add-product', { ...productForm.value })
//   }
  principalStore.showModalProductos = false;
  principalStore.editingProduct = { 
        producto_id: 0,
        nombre: '',
        descripcion: '',
        codigo_barras: '',
        stock: 0,
        stock_minimo: 0,
        precio_venta: 0,
        idproveedor: '',
        categorias: { categoria_id: 0, nombre: '' }
}
}

const closeModal = () => {
  principalStore.showModalProductos = false;
  principalStore.editingProduct = { 
        producto_id: 0,
        nombre: '',
        descripcion: '',
        codigo_barras: '',
        stock: 0,
        stock_minimo: 0,
        precio_venta: 0,
        idproveedor: '',
        categorias: { categoria_id: 0, nombre: '' }
};
}

</script>

<style scoped>

</style>