<template>
    <div class="container mx-auto">
        <Alert :type="alertType" :message="alertMessage" :isVisible="showAlert" dismissible @close="handleClose"
            v-show="showAlert" />

        <loadingSpinner :isLoading="isLoading" />
        <Inventory 
        :products="principalStore.productos" 
        :totalProducts="principalStore.numeroProductos" 
        @filtrar-product="filtrarProducts"
        @editar-producto="abrirModalEditar"
        @add-producto="abrirModalAdd"
        @delete-producto="abrirModalDelete"
        @cambiar-pagina="cambiarPagina" 
        />
        <ModalProductos 
        :visible="ModalVisible"
        :productoEditar="productoSeleccionado"
        @cerrar="cerrarModal" 
        />

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
            @click="onDeleteProduct"
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

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Inventory from '../../dashboard/components/inventario.vue';
import ModalProductos from '../../dashboard/components/modalProductos.vue';
import { ProductoPeticion } from '../../../interfaces/Producto.ts';
import Alert from '../../common/components/alertComponent.vue'
import loadingSpinner from '../../common/components/loadingSpinner.vue';
import { useprincipalStore } from '../../../store/index.ts';

const principalStore = useprincipalStore();

const showAlert = ref(false);
const alertMessage = ref<string>('');
const alertType = ref<'success' | 'error' | 'warning' | 'info'>('info');
const isLoading = ref(false)
const searchQuery = ref<string>('');


const ModalVisible = ref(false);
const showDeleteConfirm = ref(false)
const productoSeleccionado = ref<ProductoPeticion>({
    producto_id: 0,
    nombre: '',
    descripcion: '',
    codigo_barras: '',
    stock: 0,
    stock_minimo: 0,
    precio_venta: 0,
    idproveedor: '',
    categorias: { categoria_id: 0, nombre: '' },
    subtotal: 0,
    cantidad: 0,
});
const idProductoEliminar = ref(0);

const cerrarModal = () => {
    ModalVisible.value = false;
    productoSeleccionado.value = {
        producto_id: 0,
        nombre: '',
        descripcion: '',
        codigo_barras: '',
        stock: 0,
        stock_minimo: 0,
        precio_venta: 0,
        idproveedor: '',
        categorias: { categoria_id: 0, nombre: '' },
        subtotal: 0,
        cantidad: 0,
     };
     if (principalStore.msgProductos) {
     alertType.value = principalStore.msgProductos.tipo; 
     showAlert.value = true;
     alertMessage.value = principalStore.msgProductos.mensaje;
     principalStore.msgProductos = null; // Limpiar error después de mostrar
  }
}

const abrirModalEditar = (producto: ProductoPeticion) => {
    productoSeleccionado.value = { ...producto };
    ModalVisible.value = true;
}

const abrirModalAdd = () => {
    ModalVisible.value = true;
}

const abrirModalDelete = (productId: string) => {
  idProductoEliminar.value = Number(productId);
  showDeleteConfirm.value = true;
}


onMounted(() => {
    onLoadProducts('', 1, 50);
    onLoadProveedores();
});

const onLoadProducts = async (busqueda: string, cuerrentPage: number, pageSize: number) => {
    isLoading.value = true
    await  principalStore.fetchProducts(busqueda, cuerrentPage, pageSize);
    isLoading.value = false
}

const onLoadProveedores = async ()=> {
     await principalStore.fetchProveedores();
}

const onDeleteProduct = async () => {
    await principalStore.deleteProducto(idProductoEliminar.value);
    showDeleteConfirm.value = false;
    idProductoEliminar.value = 0;
      if (principalStore.msgProductos) {
     alertType.value = principalStore.msgProductos.tipo; 
     showAlert.value = true;
     alertMessage.value = principalStore.msgProductos.mensaje;
     principalStore.msgProductos = null; // Limpiar error después de mostrar
  }
}


const handleClose = () => {
    showAlert.value = false;
};

const cambiarPagina = (pagina: number) => {
    onLoadProducts(searchQuery.value, pagina, 50);
}

const filtrarProducts = (query: string) => {
    searchQuery.value = query;
    onLoadProducts(query, 1, 50);
}

</script>
