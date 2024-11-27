<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Fecha</th>
          <th>Total</th>
          <th>Detalles</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="venta in ventas" :key="venta.venta_id">
          <tr>
            <td>{{ venta.venta_id }}</td>
            <td>{{ new Date(venta.fecha_venta).toLocaleString() }}</td>
            <td>{{ formatCurrency(venta.total) }}</td>
            <td>
              <button class="bg-secondary-color text-white px-2 py-1 rounded hover:bg-red-600" 
              @click="toggleDetails(venta.venta_id)">
                {{ expandedSaleId === venta.venta_id ? "Ocultar" : "Ver" }}
              </button>
            </td>
          </tr>
          <!-- Detalles de productos -->
          <tr v-if="expandedSaleId === venta.venta_id" :key="'details-' + venta.venta_id">
            <td colspan="4">
              <table class="details-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="detalle in venta.detalle" :key="detalle.producto">
                    <td>{{ detalle.producto }}</td>
                    <td>{{ detalle.cantidad }}</td>
                    <td>{{ detalle.subtotal }}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
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
