<template>
    <div>
        <h1>Ventas</h1>
        <tablaVentas :ventas="ventas"/>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import tablaVentas from '../components/tablaVentas.vue';
import { VentaRespuesta } from '../../../interfaces/Venta';
import { getVentas } from '../../../services/ventas/ventasService';

const ventas = ref<VentaRespuesta[]>([]);

onMounted(() => {
    onLoadVentas();
})

const onLoadVentas = async () => {
    const response =await getVentas();

    if (!response.success) {
        console.log(response.error);
        
    }else{
        ventas.value = response.data;
        console.log(ventas.value);
        
    }
}

</script>

