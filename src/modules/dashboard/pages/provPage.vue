<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Encabezado -->
    <div class="bg-purple-700 text-white text-xl font-semibold p-4 rounded-b-md shadow">
      Proveedores
    </div>

    <!-- Contenido principal -->
    <div class="p-4 max-w-xl mx-auto">
      <AlertComponent v-if="showAlert" :type="alertType" :message="alertMessage" dismissible @close="showAlert = false" />

      <!-- Input de búsqueda -->
      <input v-model="busqueda" type="text" placeholder="Buscar Proveedor"
        class="w-full p-2 mb-4 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />



      <!-- Lista de proveedores -->
      <div v-for="proveedor in proveedoresFiltrados" :key="proveedor.id" @click="verDetalle(proveedor.id)"
        class="flex items-center bg-white rounded-lg shadow-sm p-4 mb-4 cursor-pointer hover:border-purple-500 transition border border-transparent"
        :class="{ 'border-2 border-blue-400': proveedor.id === seleccionado }">
        <img :src="proveedor.imagen" alt="Foto del proveedor" class="w-12 h-12 rounded-full mr-4 object-cover" />

        <div class="flex-1">
          <h3 class="text-lg font-medium text-gray-800">{{ proveedor.nombre }}</h3>
          <p class="text-sm text-gray-500">{{ proveedor.empresa }}</p>
        </div>

        <div class="flex items-center space-x-3 text-gray-600">
          <span class="text-sm">📞 {{ proveedor.telefono }}</span>
          <button @click.stop="eliminarProveedor(proveedor.id)" class="hover:text-red-600">🗑️</button>
          <button @click.stop="editarProveedor(proveedor)" class="hover:text-yellow-500">✏️</button>
        </div>
      </div>

      <!-- Botón Nuevo -->
      <div class="flex justify-end">
        <button @click="nuevoProveedor"
          class="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-2 rounded-full shadow transition">
          Nuevo
        </button>
      </div>
      <ProveedorForm v-if="mostrarForm" :proveedor="proveedorActual" :modo="modo" @guardado="cerrarForm"
        @cerrar="cerrarForm" />

      <ConfirmComponent v-if="mostrarConfirmacion" titulo="Eliminar proveedor"
        mensaje="¿Estás seguro de que deseas eliminar este proveedor? Esta acción no se puede deshacer."
        @confirmar="eliminarProveedorConfirmado" @cancelar="cerrarConfirmacion" />

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Proveedor } from '../../../interfaces/Proveedor'
import { useprincipalStore } from '../../../store';
import ProveedorForm from '../components/proveedorForm.vue';
import ConfirmComponent from '../../common/components/confirmComponent.vue';
import AlertComponent from '../../common/components/alertComponent.vue';
const principalStore = useprincipalStore();

const showAlert =ref(false);
const alertMessage = ref('');
const alertType = ref<'success'|'error'|'warning'|'info'>('info');


const router = useRouter()
const busqueda = ref('')
const seleccionado = ref(null)
const mostrarConfirmacion = ref(false)

const mostrarForm = ref(false)
const proveedorActual = ref<Proveedor>({
  id: '',
  nombre: '',
  empresa: '',
  correo: '',
  telefono: '',
  direccion: '',
  notas: '',
  imagen: ''
})
const modo = ref('crear') // 'crear' o 'editar'

onMounted(() => {
  principalStore.fetchProveedores();
});

const proveedoresFiltrados = computed(() =>
  principalStore.proveedores.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
  )
)

const verDetalle = (id: any) => {
  seleccionado.value = id
  router.push({ name: 'detalleProveedor', params: { id } })
}

const eliminarProveedor = (id: any) => {
  mostrarConfirmacion.value = true
  seleccionado.value = id
}

const eliminarProveedorConfirmado = async () => {
  if (seleccionado.value !== null) {
    await principalStore.deleteProveedor(seleccionado.value)
  }
  cerrarConfirmacion()
}

const editarProveedor = (proveedor: Proveedor) => {
  proveedorActual.value = { ...proveedor }
  modo.value = 'editar'
  mostrarForm.value = true
}

const cerrarForm = () => {
  mostrarForm.value = false
  if (principalStore.msgProveedores) {
     alertType.value = principalStore.msgProveedores.tipo 
     showAlert.value = true;
     alertMessage.value = principalStore.msgProveedores.mensaje;
     principalStore.msgProveedores = null; // Limpiar error después de mostrar
  }
}

const nuevoProveedor = () => {
  proveedorActual.value = {
    id: '',
    nombre: '',
    empresa: '',
    correo: '',
    telefono: '',
    direccion: '',
    notas: '',
    imagen: ''
  }
  modo.value = 'crear'
  mostrarForm.value = true
}

const cerrarConfirmacion = () => {
  seleccionado.value = null
  mostrarConfirmacion.value = false
   if (principalStore.msgProveedores) {
     alertType.value = principalStore.msgProveedores.tipo;
     showAlert.value = true;
     alertMessage.value = principalStore.msgProveedores.mensaje;
     principalStore.msgProveedores = null; // Limpiar error después de mostrar
  }
}



</script>
