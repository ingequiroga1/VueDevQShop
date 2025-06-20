<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-xl mx-auto bg-white rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Nuevo Proveedor</h2>

      <form @submit.prevent="guardarProveedor" class="space-y-4">
        <!-- Nombre -->
        <div>
          <label class="block text-gray-700 mb-1">Nombre:</label>
          <input
            v-model="form.nombre"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <!-- Empresa -->
        <div>
          <label class="block text-gray-700 mb-1">Empresa:</label>
          <input
            v-model="form.empresa"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <!-- Teléfono -->
        <div>
          <label class="block text-gray-700 mb-1">Teléfono:</label>
          <input
            v-model="form.telefono"
            type="tel"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <!-- correo -->
        <div>
          <label class="block text-gray-700 mb-1">Correo:</label>
          <input
            v-model="form.correo"
            type="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
          />
        </div>

         <!-- Direccion -->
        <div>
          <label class="block text-gray-700 mb-1">Dirección:</label>
          <input
            v-model="form.direccion"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
          />
        </div>

         <!-- Notas -->
        <div>
          <label class="block text-gray-700 mb-1">Notas:</label>
          <input
            v-model="form.notas"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <!-- Botones -->
        <div class="flex justify-between mt-6">
          <button
            type="button"
            @click="cancelar"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { crearProveedor } from '../../../services/ventas/proveedorService'

const router = useRouter()

const form = ref({
  nombre: '',
  empresa: '',
  telefono: '',
  correo: '',
  direccion: '',
  notas: ''
})

const guardarProveedor = async () => {
  // Aquí podrías guardar en Supabase, Firebase, API, etc.
  const response = await crearProveedor(form.value);
  console.log('Proveedor guardado:', response)
  // Redirige al listado de proveedores
  router.push({ name: 'proveedores' })
}

const cancelar = () => {
  router.push({ name: 'proveedores' })
}
</script>
