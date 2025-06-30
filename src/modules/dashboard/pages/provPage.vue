<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Encabezado -->
    <div class="bg-purple-700 text-white text-xl font-semibold p-4 rounded-b-md shadow">
      Proveedores
    </div>

    <!-- Contenido principal -->
    <div class="p-4 max-w-xl mx-auto">
      <!-- Input de búsqueda -->
      <input
        v-model="busqueda"
        type="text"
        placeholder="Buscar Proveedor"
        class="w-full p-2 mb-4 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <!-- Lista de proveedores -->
      <div
        v-for="proveedor in proveedoresFiltrados"
        :key="proveedor.id"
        @click="verDetalle(proveedor.id)"
        class="flex items-center bg-white rounded-lg shadow-sm p-4 mb-4 cursor-pointer hover:border-purple-500 transition border border-transparent"
        :class="{ 'border-2 border-blue-400': proveedor.id === seleccionado }"
      >
        <img
          :src="proveedor.imagen"
          alt="Foto del proveedor"
          class="w-12 h-12 rounded-full mr-4 object-cover"
        />

        <div class="flex-1">
          <h3 class="text-lg font-medium text-gray-800">{{ proveedor.nombre }}</h3>
          <p class="text-sm text-gray-500">{{ proveedor.empresa }}</p>
        </div>

        <div class="flex items-center space-x-3 text-gray-600">
          <span class="text-sm">📞 {{ proveedor.telefono }}</span>
          <button @click.stop="eliminarProveedor(proveedor.id)" class="hover:text-red-600">🗑️</button>
          <button @click.stop="editarProveedor(proveedor.id)" class="hover:text-yellow-500">✏️</button>
        </div>
      </div>

      <!-- Botón Nuevo -->
      <div class="flex justify-end">
        <button
          @click="router.push({ name: 'nuevo-proveedor' })"
          class="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-2 rounded-full shadow transition"
        >
          Nuevo
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"> 
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Proveedor } from '../../../interfaces/Proveedor'
import { useprincipalStore } from '../../../store';
// import { getProveedores } from '../../../services/ventas/proveedorService'
const principalStore = useprincipalStore();


const router = useRouter()
const busqueda = ref('')
const seleccionado = ref(null)

const proveedores = ref<Proveedor[]>([]);

onMounted(() => {
  principalStore.fetchProveedores();
});

const proveedoresFiltrados = computed(() =>
  principalStore.proveedores.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
  )
)

// const onLoadProveedores = async () => {
//   // Aquí podrías cargar los proveedores desde tu servicio
//    const response = await getProveedores('',1,50);
//   if (response.success) {
//     console.log('Proveedores cargados:', response.data);
//     proveedores.value = response.data;
//   } else {
//     console.log('Error al cargar proveedores:', response.error);
    
//     // alertType.value = 'error';
//     // showAlert.value = true;
//     // alertMessage.value = `Error al cargar proveedores: ${response.error}`;
//    }
//   }

const verDetalle = (id:any) => {
  seleccionado.value = id
  router.push({ name: 'detalleProveedor', params: { id } })
}

const eliminarProveedor = (id:any) => {
  proveedores.value = proveedores.value.filter(p => p.id !== id)
}

const editarProveedor = (id:any) => {
  alert(`Editar proveedor con ID ${id}`)
}

</script>
