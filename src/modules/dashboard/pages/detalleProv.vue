<template>
  <div class="p-6 max-w-4xl mx-auto space-y-6">
    <!-- Encabezado -->
    <h2 class="text-2xl font-bold text-gray-800">Detalle del proveedor</h2>

    <!-- Tarjeta: Datos del proveedor -->
    <div class="bg-white shadow-md rounded-xl p-6 border">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">Información del proveedor</h3>
      <p class="text-gray-700"><strong>ID:</strong> {{ $route.params.id }}</p>
      <p class="text-gray-700"><strong>Nombre:</strong> {{ proveedor.nombre }}</p>
      <p class="text-gray-700"><strong>Empresa:</strong> {{ proveedor.empresa }}</p>
    </div>

    <!-- Encabezado -->
    <h2 class="text-2xl font-bold text-gray-800">Productos</h2>
    <!-- Tarjeta: Productos asociados -->
     <div v-if="principalStore.productosxproveedor.length > 0" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="product in principalStore.productosxproveedor"
          :key="product.id"
          class="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm transition hover:shadow-md cursor-pointer"
        >
         <p class="mb-1"><strong>Id:</strong> {{ product.producto_id }}</p>
          <p class="mb-1"><strong>Nombre:</strong> {{ product.nombre }}</p>
          <p class="mb-1"><strong>Descripción:</strong> {{ product.descripcion }}</p>
          <p class="mb-1"><strong>Stock:</strong> {{ product.stock }}</p>
        </div>
      </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useprincipalStore } from '../../../store';

const principalStore = useprincipalStore();
// Simulación de carga de datos
const route = useRoute();
const proveedorId = route.params.id;

const proveedor = ref({ nombre: '', empresa: '' });
const productos = ref([]);



onMounted(async () => {
  // Simula una petición a tu backend para obtener el proveedor
 
  proveedor.value = principalStore.getProveedor(proveedorId);
  console.log('Proveedor:', proveedor.value);
  await principalStore.fetchProdxProv(proveedorId);
  
  
  //productos.value = await principalStore.fetchProdxProv(proveedorId);
});

// Simulaciones de funciones de fetch (reemplaza con tu lógica real o API)
async function obtenerProveedorPorId(id) {
  // Aquí iría una petición a Supabase, Firebase o tu backend
  return {
    id,
    nombre: 'Proveedor Ejemplo',
    empresa: 'Empresa S.A. de C.V.',
  };
}

</script>

<style scoped>
/* Puedes personalizar estilos aquí si es necesario */
</style>
