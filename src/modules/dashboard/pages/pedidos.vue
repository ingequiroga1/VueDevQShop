


<template>
    <div class="px-4 py-6">
        <h1 class="text-2x1 font-bold text-center mb-4">
        Pedidos
        </h1>
        <div v-if="orders.length > 0" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="order in orders" :key="order.id" class="bg-gray-100 p-4 rounded-lg shadow">
                <p><strong>Cliente:</strong>{{ order.client }}</p>
                <p><strong>Direccion:</strong>{{ order.address }}</p>
                <p><strong>Fecha:</strong>{{ formatDate(order.date) }}</p>
                <p :class="['font-bold', order.status.toLowerCase()]">
                    <strong>Estatus:</strong>{{ order.status }}
                </p>
            </div>
        </div>
        <div v-else>
            <p class="text-center text-gray-500 text-lg">No hay pedidos disponibles.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// import { supabase } from '../../../services/supabaseClient';


    type Order = {
        id: number;
        client: string;
        address: string;
        date: string;
        status: 'Pendiente' | 'En Proceso' | 'Completado';
    };

const orders = ref<Order[]>([
    {
        id: 1,
        client: 'Juan Perez',
        address: 'Calle Falsa 123, Ciudad',
        date: '2024-12-14',
        status: 'Pendiente',
    },
    {
        id: 2,
        client: 'Ana Lopez',
        address: 'Avenida siempre viva 742, Ciudad',
        date: '2024-12-13',
        status:'Completado',
    },
])


const formatDate = (date:string): string => {
    const options: Intl.DateTimeFormatOptions = {year: 'numeric', month: 'long', day: 'numeric'};
    return new Date(date).toLocaleDateString('es-ES', options);
};

// const suscVentas = supabase
//     .channel('public:ventas')
//     .on(
//         'postgres_changes',
//         {
//             event: 'INSERT',
//             schema: 'public',
//             table: 'ventas',
//             filter: 'estado=eq.Pendiente'
//         },
//         (payload) => {
//             console.log('Cambio detectado:', payload.new);
//         }
//     )
//     .subscribe();

</script>
