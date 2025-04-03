<template>
    <div>
        <h1>Ventas</h1>
        <ventaBuscar @search="onLoadVentas" />
        <tablaVentas :ventas="ventas"/>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import tablaVentas from '../components/tablaVentas.vue';
import { VentaRespuesta } from '../../../interfaces/Venta';
import { getVentasxFecha } from '../../../services/ventas/ventasService';
import ventaBuscar from '../components/ventaBuscar.vue';

const ventas = ref<VentaRespuesta[]>([]);

// onMounted(() => {
//     onLoadVentas();
// })

interface DateRange{
    startDate: string,
    endDate: string
}

const onLoadVentas = async ({startDate,endDate}:DateRange) => {
    const response =await getVentasxFecha(startDate,endDate);

    if (!response.success) {
        console.log(response.error);
        
    }else{
        ventas.value = response.data;
        console.log(ventas.value);
        
    }
}

</script>

