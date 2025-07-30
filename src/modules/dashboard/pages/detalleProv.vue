<template>
  <div v-if="proveedorSelecionado" class="p-6 max-w-4xl mx-auto space-y-6">
    <!-- Encabezado -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-800">Detalle del proveedor</h2>
    </div>

    <!-- Tarjeta: Datos del proveedor -->
    <div class="bg-white shadow-md rounded-xl p-6 border">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">Información del proveedor</h3>
      <p class="text-gray-700"><strong>ID:</strong> {{ $route.params.id }}</p>
      <p class="text-gray-700"><strong>Nombre:</strong> {{ proveedorSelecionado.nombre }}</p>
      <p class="text-gray-700"><strong>Empresa:</strong> {{ proveedorSelecionado.empresa }}</p>
    </div>

    <!-- Encabezado productos -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-800">Productos</h2>
      <button @click="abrirModalAdd" class="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition">
        + Agregar producto
      </button>
    </div>

    <!-- Tarjeta: Productos asociados -->
    <div v-if="principalStore.productosxproveedor.length > 0" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="product in principalStore.productosxproveedor" :key="product.producto_id"
        class="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm transition hover:shadow-md cursor-pointer flex flex-col justify-between">
        <div class="space-y-1 mb-4">
          <p><strong>Id:</strong> {{ product.producto_id }}</p>
          <p><strong>Nombre:</strong> {{ product.nombre }}</p>
          <p><strong>Descripción:</strong> {{ product.descripcion }}</p>
          <p><strong>Stock:</strong> {{ product.stock }}</p>
        </div>
        <div class="flex gap-2">
          <button @click="abrirModalEditar(product)"
            class="flex-1 bg-blue-500 text-white py-1 rounded-md hover:bg-blue-600 transition">
            Editar
          </button>
          <button @click="abrirModalDelete(String(product.producto_id))"
            class="flex-1 bg-red-500 text-white py-1 rounded-md hover:bg-red-600 transition">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>

  <ModalProductos 
    :visible="ModalVisible" 
    :productoEditar="productoSeleccionado" 
    :proveedor="proveedorSelecionado"
    @cerrar="cerrarModal" 
  />

  <!-- Modal de confirmación de eliminación -->
  <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-sm">
      <h3 class="text-lg font-semibold mb-4">Confirmar Eliminación</h3>
      <p class="text-sm mb-4">
        ¿Estás seguro de que deseas eliminar este producto?
      </p>
      <div class="flex justify-end gap-2">
        <button @click="onDeleteProduct" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Eliminar
        </button>
        <button @click="showDeleteConfirm = false" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          Cancelar
        </button>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useprincipalStore } from '../../../store';
import ModalProductos from '../components/modalProductos.vue';
import { ProductoPeticion } from '../../../interfaces/Producto';
import { Proveedor } from '../../../interfaces/Proveedor';

const principalStore = useprincipalStore();
// Simulación de carga de datos
const route = useRoute();
const proveedorId = route.params.id as string;
const proveedorSelecionado = ref<Proveedor | undefined>();
const showDeleteConfirm = ref(false)
const idProductoEliminar = ref(0);
const ModalVisible = ref(false);
const showAlert = ref(false);
const alertMessage = ref<string>('');
const alertType = ref<'success' | 'error' | 'warning' | 'info'>('info');

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



onMounted(async () => {
  proveedorSelecionado.value = principalStore.getProveedor(proveedorId);
  await principalStore.fetchProdxProv(proveedorId);
});



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

const abrirModalEditar = (producto: any) => {
  productoSeleccionado.value = {
    ...producto,
    subtotal: producto.subtotal ?? 0,
    cantidad: producto.cantidad ?? 0
  };
  ModalVisible.value = true;
}

const abrirModalAdd = () => {
  ModalVisible.value = true;
  productoSeleccionado.value = {
    producto_id: 0,
    nombre: '',
    descripcion: '',
    codigo_barras: '',
    stock: 0,
    stock_minimo: 0,
    precio_venta: 0,
    idproveedor: proveedorSelecionado.value?.id || '',
    categorias: { categoria_id: 0, nombre: '' },
    subtotal: 0,
    cantidad: 0
  }
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

const abrirModalDelete = (productId: string) => {
  idProductoEliminar.value = Number(productId);
  showDeleteConfirm.value = true;
}



</script>

<style scoped>
/* Puedes personalizar estilos aquí si es necesario */
</style>
