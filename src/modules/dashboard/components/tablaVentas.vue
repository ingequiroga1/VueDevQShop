<template>
  <div class="mt-6">
    <!-- Tabla de Ventas -->
    <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table class="min-w-full divide-y divide-gray-200 text-sm text-left text-gray-800">
        <thead class="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            <th class="px-4 py-3">#</th>
            <th class="px-4 py-3">Fecha</th>
            <th class="px-4 py-3">Total</th>
            <th class="px-4 py-3">Detalles</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <template v-if="ventas.length > 0">
            <template v-for="venta in ventas" :key="venta.venta_id">
              <tr class="hover:bg-gray-50 transition">
                <td class="px-4 py-3">{{ venta.venta_id }}</td>
                <td class="px-4 py-3">{{ new Date(venta.fecha_venta).toLocaleString() }}</td>
                <td class="px-4 py-3">{{ formatCurrency(venta.total) }}</td>
                <td class="px-4 py-3">
                  <button
                    @click="toggleDetails(venta.venta_id)"
                    class="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    <svg v-if="expandedSaleId !== venta.venta_id" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {{ expandedSaleId === venta.venta_id ? "Ocultar" : "Ver" }}
                  </button>
                </td>
              </tr>

              <!-- Detalles -->
              <tr v-if="expandedSaleId === venta.venta_id" :key="'details-' + venta.venta_id">
                <td colspan="4" class="bg-gray-50 px-4 py-3">
                  <div class="overflow-x-auto">
                    <table class="min-w-full text-sm text-left border border-gray-200">
                      <thead class="bg-white text-gray-600 font-medium">
                        <tr>
                          <th class="px-4 py-2">Producto</th>
                          <th class="px-4 py-2">Subtotal</th>
                          <th class="px-4 py-2">Cantidad</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="detalle in venta.detalle"
                          :key="detalle.producto"
                          class="hover:bg-gray-100 transition"
                        >
                          <td class="px-4 py-2">{{ detalle.producto }}</td>
                          <td class="px-4 py-2 text-right">{{ formatCurrency(detalle.subtotal) }}</td>
                          <td class="px-4 py-2 text-right">{{ detalle.cantidad }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </template>
          </template>

          <!-- Si no hay ventas -->
          <tr v-else>
            <td colspan="4" class="text-center px-4 py-6 text-gray-500">
              No hay ventas registradas para este rango de fechas.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script setup lang="ts">
import { PropType, ref } from 'vue';
import { formatCurrency } from '../../../helpers/formatosHelper';
import { VentaRespuesta } from '../../../interfaces/Venta';

defineProps({
  ventas:{
    type: Array as PropType<VentaRespuesta[]>,
    required: true
  }
})


const expandedSaleId = ref(null);



const toggleDetails = (ventaId:any) => {
      expandedSaleId.value = expandedSaleId.value === ventaId ? null : ventaId;
};

</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

.details-table {
  background-color: #f9f9f9;
  margin-top: 10px;
}

</style>
