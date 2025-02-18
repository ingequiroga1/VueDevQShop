<template>
    <Alert
    v-if="showAlert" 
    :type="alertType" 
    :message="alertMessage" 
    dismissible 
    @close="showAlert = false"
  /> 
     <div class="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <!-- Título -->
        <h1 class="text-2xl font-bold mb-4 text-gray-800">Pantalla de Ventas</h1>

        <form @submit.prevent="addProduct">
              <!-- Input para el código de barras -->
            <div class="mb-4">
                <label for="barcode" class="block text-sm font-medium text-gray-700">Código de Barras</label>
                <input 
                    type="text" 
                    id="barcode" 
                    placeholder="Ingresa el código de barras" 
                    class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    v-model="barcodeInput"
                    @keyup.enter="addProduct">
            </div>
        </form>
      

        <!-- Información de la venta -->
        <div class="flex justify-between mb-4">
            <!-- Total de la venta -->
            <div>
                <h2 class="text-lg font-semibold text-gray-700">Total de la Venta:</h2>
                <p id="totalVenta" class="text-2xl font-bold text-text-color">${{ totalVenta.toFixed(2) }}</p>
            </div>

            <!-- Número de productos -->
            <div>
                <h2 class="text-lg font-semibold text-gray-700">Número de Productos:</h2>
                <p id="numProductos" class="text-2xl font-bold text-text-color">{{ totalCantidad }}</p>
            </div>
        </div>


 
        <!-- Tabla de productos -->
         <div class="hidden sm:flex overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-200">
                <thead class="bg-gray-200">
                    <tr>
                        <th class="py-2 px-4 border-b text-center text-sm font-semibold text-gray-600">Cantidad</th>
                        <th class="py-2 px-4 border-b text-center text-sm font-semibold text-gray-600">Nombre</th>
                        <th class="py-2 px-4 border-b text-center text-sm font-semibold text-gray-600">Precio</th>
                        <th class="py-2 px-4 border-b text-center text-sm font-semibold text-gray-600">Subtotal</th>
                        <th class="py-2 px-4 border-b text-center text-sm font-semibold text-gray-600">Acciones</th>
                    </tr>
                </thead>
                <tbody id="productosTabla">
                   
                     <tr v-for="producto in productos" :key="producto.producto_id">
                        <td class="text-center">{{ producto.cantidad }}</td>
                        <td class="text-center">{{ producto.nombre }}</td>
                        <td class="text-center">${{ producto.precio_venta.toFixed(2) }}</td>
                        <td class="text-center">${{ producto.subtotal.toFixed(2) }}</td>
                        <td class="text-center">
                            <button 
                                @click="disminuirProducto(producto)"
                                class="text-red-500 hover:text-red-700 focus:outline-none text-xl" 
                                >
                                <font-awesome-icon :icon="['fas', 'minus']" />
                            </button>
                        </td>
                     </tr>
                </tbody>
            </table>
        </div>
        
        
        <div class="sm:hidden space-y-4">
            <div v-for="producto in productos" :key="producto.producto_id" class="border rounded-lg bg-white shadow p-4">
                <div class="flex justify-between">
                <span class="font-semibold text-gray-700">Cantidad:</span>
                <span class="text-gray-600">{{ producto.cantidad }}</span>
                </div>
                <div class="flex justify-between mt-2">
                <span class="font-semibold text-gray-700">Nombre:</span>
                <span class="text-gray-600">{{ producto.nombre }}</span>
                </div>
                <div class="flex justify-between mt-2">
                <span class="font-semibold text-gray-700">Precio:</span>
                <span class="text-gray-600">${{ producto.precio_venta.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between mt-2">
                <span class="font-semibold text-gray-700">Subtotal:</span>
                <span class="text-gray-600">${{ producto.subtotal.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between mt-2">
                <span class="font-semibold text-gray-700">Acciones:</span>
                <button 
                                @click="disminuirProducto(producto)"
                                class="text-red-500 hover:text-red-700 focus:outline-none text-xl" 
                                >
                                <font-awesome-icon :icon="['fas', 'minus']" />
                </button>
                </div>
            </div>
        </div>


        <div class="flex flex-row-reverse mt-4">
            <button
                @click="isOpen = true"
                class="bg-primary-color text-white font-bold py-2 px-4 rounded hover:bg-secondary-color"
            >
            Cobrar
            </button>
        </div>
    </div>
    <!-- Modal Cobro-->
     <div 
        v-if="isOpen"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"    
     >
     <div v-if="!esGenerada" class="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-semibold mb-4">Monto Recibido</h2>
        <div>
            <input 
                    type="number"
                    v-model="monto"  
                    placeholder="$0.00" 
                    class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
        </div>
        <div>
            <p class="mb-4 mt-4">
            Total ${{ totalVenta.toFixed(2) }}
        </p>

        <p class="mb-4 mt-4">
            Cambio ${{ cambio.toFixed(2) }}
        </p>
        </div>

        <div class="flex gap-2 flex-wrap">
            <button
                @click="agregarMonto(10)"
                class="bg-secondary-color text-white font-bold py-2 px-4 rounded"
            >$10</button>

            <button
                @click="agregarMonto(20)"
                class="bg-secondary-color text-white font-bold py-2 px-4 rounded"
            >$20</button>

            <button
                @click="agregarMonto(50)"
                class="bg-secondary-color text-white font-bold py-2 px-4 rounded"
            >$50</button>
            <button
                @click="agregarMonto(100)"
                class="bg-secondary-color text-white font-bold py-2 px-4 rounded"
            >$100</button>
            <button
                @click="agregarMonto(200)"
                class="bg-secondary-color text-white font-bold py-2 px-4 rounded"
            >$200</button>
            <button
                @click="agregarMonto(500)"
                class="bg-secondary-color text-white font-bold py-2 px-4 rounded"
            >$500</button>
        </div>

        <div class="flex flex-row-reverse mt-6 gap-2">
            <button
        @click="cerrarModal"
        class="bg-secondary-color text-white font-bold py-2 px-4 rounded"
        >Cerrar</button>
        <button
        @click="generarVenta"
        class="bg-primary-color text-white font-bold py-2 px-4 rounded"
        >Generar Venta</button>
        </div>
     </div>

     <div v-else class="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-semibold mb-4">Se registro la venta por:</h2>
        <div>
            <p class="mb-4 mt-4">
            Total ${{ totalVenta.toFixed(2) }}
        </p>
        <p class="mb-4 mt-4">
            Cambio ${{ cambio.toFixed(2) }}
        </p>
        </div>

        <div class="flex flex-row-reverse mt-6 gap-2">
            <button
        @click="terminar"
        class="bg-secondary-color text-white font-bold py-2 px-4 rounded hover:bg-primary-color"
        >Salir</button>
            <button
        @click="imprimirPdf"
        class="bg-primary-color text-white font-bold py-2 px-4 rounded hover:bg-secondary-color"
        >Imprimir Ticket</button>
        </div>
     </div>
     </div>
</template>

<script setup lang="ts">
import {ref,reactive,computed, onMounted} from 'vue';
import {ProductoPeticion,ProductoRespuesta} from '../../../interfaces/Producto.ts';
import generarPdf from '../../../helpers/generarPdfHelper.ts'
import {guardarVenta} from '../../../services/ventas/ventasService.ts'
import { getProductos, getProductoxCB } from '../../../services/ventas/productoService.ts';
import Alert from '../../common/components/alertComponent.vue'



const barcodeInput = ref('');
const isOpen = ref(false);
const monto = ref(0);
const esGenerada = ref(false);

const showAlert =ref(false);
const alertMessage = ref('');
const alertType = ref<'success'|'error'|'warning'|'info'>('info');

const productos = reactive<ProductoPeticion[]>([]);

const totalVenta = computed(() => {
    return productos.reduce((sum,product) => sum + product.subtotal,0);
})

const totalCantidad = computed(() => {
    return productos.reduce((sum,product) => sum + product.cantidad,0);
})

const cambio = computed(() => Math.max(monto.value - totalVenta.value,0));

const allProducts = ref<ProductoRespuesta[] | null>([]);

onMounted(() => {
 onLoadProducts();
});

const onLoadProducts = async() => {
    const respuesta = await getProductos();
    if (respuesta.success) {
        allProducts.value = respuesta.data;
    }else{
        console.log(respuesta.error);
    }
}

const addProduct = async (event:any) =>{
    event.preventDefault();
    const barcode = barcodeInput.value.trim();
    if (barcode === '') return;
    
    const product =  await getProductoxCB(barcode)//allProducts.value?.find(p => p.codigo_barras === barcode);
    
     if (product.success) {
         const existingProduct = productos.find(p => p.producto_id === product.data.producto_id);

         if (existingProduct) {
             //Si el producto ya esta en la tabla aumenta la cantidad en 1 y actualiza el subtotal
             existingProduct.cantidad += 1;
             existingProduct.subtotal = existingProduct.cantidad * existingProduct.precio_venta;
         }else{
             //Si no existe se agrega a la tabla 
             productos.push({
                 ...product.data,
                 cantidad: 1,
                 subtotal: product.data.precio_venta
             });
         }
     }
     else
     {
         console.warn('Producto no encontrado');
            
     }
    barcodeInput.value = '';
};

const disminuirProducto = (product:ProductoPeticion) => {
    if (product.cantidad > 1) {
        product.cantidad -= 1;
        product.subtotal = product.cantidad * product.precio_venta;
    }else{
        const index = productos.findIndex(p => p.producto_id == product.producto_id);
        if(index !== -1) productos.splice(index,1);
    }
}

const agregarMonto = (valor:number) =>{
    monto.value += valor;
}

const cerrarModal = () => {
    monto.value = 0;
    isOpen.value = false;
}

const generarVenta = async () => {
    if(monto.value > totalVenta.value){
        const respuesta = await guardarVenta(totalVenta.value,'Efectivo',15,'Completa',productos);
    if (respuesta.success) {
        alertType.value = 'success';
        showAlert.value = true;
        alertMessage.value = 'Se genero la orden de venta correctamente';
    }
    //TODO Agregar mensaje de confirmacion o error
    esGenerada.value = true;
    } else {
        console.log('El monto recibido es menor al total de la venta');
    }
}

const imprimirPdf = () =>{
    generarPdf(productos);
}

const terminar = () =>{
    //productos.value = [];
    isOpen.value = false;
    window.location.reload();
}

</script>

<style lang="scss" scoped>

</style>