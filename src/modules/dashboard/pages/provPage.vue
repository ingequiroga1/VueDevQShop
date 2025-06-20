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
          src="https://ui-avatars.com/api/?name=Juan+Sanchez&background=007bff&color=fff&bold=true"
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

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const busqueda = ref('')
const seleccionado = ref(null)

const proveedores = ref([
  {
    id: 1,
    nombre: 'María López',
    empresa: 'Distribuidora Central',
    telefono: '0292 180',
    imagen: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  {
    id: 2,
    nombre: 'Carlos Pérez',
    empresa: 'Proveedor del Norte',
    telefono: '0292 181',
    imagen: 'https://randomuser.me/api/portraits/men/2.jpg'
  }
])

const proveedoresFiltrados = computed(() =>
  proveedores.value.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
  )
)

const verDetalle = (id) => {
  seleccionado.value = id
  router.push({ name: 'detalleProveedor', params: { id } })
}

const eliminarProveedor = (id) => {
  proveedores.value = proveedores.value.filter(p => p.id !== id)
}

const editarProveedor = (id) => {
  alert(`Editar proveedor con ID ${id}`)
}

</script>
