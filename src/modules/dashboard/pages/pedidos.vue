


<template>
    <div class="px-4 py-6">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-3xl font-bold text-center w-full">Pedidos</h1>
        <button
        @click="fetchOrders"
        :disabled="loading"
        class="ml-4 px-4 py-2 flex items-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <svg
          v-if="loading"
          class="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          ></path>
        </svg>
        <span>{{ loading ? 'Cargando...' : 'Actualizar' }}</span>
      </button>
      </div>
  
      <div v-if="orders.length > 0" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="order in orders"
          :key="order.venta_id"
           @click="openOrderModal(order)"
          class="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm transition hover:shadow-md cursor-pointer"
        >
         <p class="mb-1"><strong>Id:</strong> {{ order.venta_id }}</p>
          <p class="mb-1"><strong>Cliente:</strong> {{ order.cliente }}</p>
          <p class="mb-1"><strong>Dirección:</strong> {{ order.direccion }}</p>
          <p class="mb-1"><strong>Fecha:</strong> {{ formatDate(order.fecha_venta) }}</p>
          <p class="mt-2 font-bold" :class="statusColor(order.estado)">
            <strong>Estatus:</strong> {{ order.estado }}
          </p>
        </div>
      </div>
  
      <div v-else class="text-center text-gray-500 text-lg mt-8">
        <p>No hay pedidos disponibles.</p>
      </div>
       <!-- Modal -->
      <div v-if="selectedOrder" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative">
        <button @click="closeModal" class="absolute top-2 right-2 text-gray-400 hover:text-black text-xl">&times;</button>
        <h2 class="text-2xl font-bold mb-4">Detalles del Pedido</h2>
        <p><strong>Cliente:</strong> {{ selectedOrder.cliente }}</p>
        <p><strong>Dirección:</strong> {{ selectedOrder.direccion }}</p>
        <p><strong>Fecha:</strong> {{ formatDate(selectedOrder.fecha_venta) }}</p>
        <p><strong>Total:</strong> ${{ selectedOrder.total.toFixed(2) }}</p>
        <p><strong>Estatus:</strong> {{ selectedOrder.estado }}</p>

        <div class="mt-4">
          <h3 class="text-lg font-semibold mb-2">Productos</h3>
          <table class="w-full text-sm border">
            <thead>
              <tr class="bg-gray-100 text-left">
                <th class="py-1 px-2">Descripción</th>
                <th class="py-1 px-2 text-right">Precio Unitario</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(producto, index) in selectedOrder.productos" :key="index">
                <td class="py-1 px-2">{{ producto.nombre }}</td>
                <td class="py-1 px-2 text-right">${{ producto.precio_unitario.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <button
          class="mt-6 w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Completar pedido
        </button>
      </div>
    </div>
    </div>
  </template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getVentasPendientes } from '../../../services/ventas/ventasService';
import { PedidoMapeado } from '../../../interfaces/Venta';


const orders = ref<PedidoMapeado[]>([])
const loading = ref(false);
const selectedOrder = ref<PedidoMapeado | null>(null);


const formatDate = (date:string): string => {
    const options: Intl.DateTimeFormatOptions = {year: 'numeric', month: 'long', day: 'numeric'};
    return new Date(date).toLocaleDateString('es-ES', options);
};

onMounted(async () => {
   const response = await getVentasPendientes()
   if (!response.success) {
        console.log(response.error);
    }else{
        orders.value = response.data;
    }
      

});

const fetchOrders = async () => {
    loading.value = true;
    const response = await getVentasPendientes()
    loading.value = false;
    if (!response.success) {
        console.log(response.error);
        
    }else{
        orders.value = response.data;
    }
}

// Devolver clases de color según el estatus
function statusColor(estado: 'pendiente' | 'completado' | 'cancelado' | string): string {
  const colorMap: Record<'pendiente' | 'completado' | 'cancelado', string> = {
    pendiente: 'text-yellow-600',
    completado: 'text-green-600',
    cancelado: 'text-red-600'
  };
  return colorMap[estado.toLowerCase() as 'pendiente' | 'completado' | 'cancelado'] || 'text-gray-800';
}

function openOrderModal(order:any) {
  selectedOrder.value = { ...order };
}

function closeModal() {
  selectedOrder.value = null;
}




</script>
