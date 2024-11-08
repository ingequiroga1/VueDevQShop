<template>
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
                <p id="totalVenta" class="text-2xl font-bold text-indigo-600">${{ totalVenta.toFixed(2) }}</p>
            </div>

            <!-- Número de productos -->
            <div>
                <h2 class="text-lg font-semibold text-gray-700">Número de Productos:</h2>
                <p id="numProductos" class="text-2xl font-bold text-indigo-600">{{ totalCantidad }}</p>
            </div>
        </div>

        <!-- Tabla de productos -->
        <div class="overflow-x-auto">
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
                    <!-- Filas de productos se agregarán aquí dinámicamente -->
                     <tr v-for="producto in productos" :key="producto.id">
                        <td class="text-center">{{ producto.cantidad }}</td>
                        <td class="text-center">{{ producto.nombre }}</td>
                        <td class="text-center">${{ producto.precio.toFixed(2) }}</td>
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
        <div>
            <button
                @click="isOpen = true"
                class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
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

        <div class="flex gap-2">
            <button
                @click="agregarMonto(10)"
                class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
            >$10</button>

            <button
                @click="agregarMonto(20)"
                class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
            >$20</button>

            <button
                @click="agregarMonto(50)"
                class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
            >$50</button>
        </div>

        <div class="flex flex-row-reverse mt-6 gap-2">
            <button
        @click="cerrarModal"
        class="bg-red-500 text-white font-bold py-2 px-4 rounded"
        >Cerrar</button>
        <button
        @click="generarVenta"
        class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
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
        class="bg-red-500 text-white font-bold py-2 px-4 rounded"
        >Salir</button>
            <button
        @click="imprimirPdf"
        class="bg-red-500 text-white font-bold py-2 px-4 rounded"
        >Imprimir Ticket</button>
        </div>
     </div>
     </div>
     <modal-pdf v-if="showModalPdf" @close="showModalPdf=false" />
</template>

<script setup lang="ts">
import {ref,reactive,computed} from 'vue';
import {Producto} from '../../../interfaces/Producto.ts';
import ModalPdf from '../components/modalPdf.vue'


const barcodeInput = ref('');
const isOpen = ref(false);
const monto = ref(0);
const esGenerada = ref(false);
const showModalPdf = ref(false);

const productos = reactive<Producto[]>([]);

const totalVenta = computed(() => {
    return productos.reduce((sum,product) => sum + product.subtotal,0);
})

const totalCantidad = computed(() => {
    return productos.reduce((sum,product) => sum + product.cantidad,0);
})

const cambio = computed(() => Math.max(monto.value - totalVenta.value,0));

const allProducts: Producto[] = [
        {
            "id": 1,
            "nombre": "Coca-Cola 500ml",
            "precio": 15,
            "cantidad": 0, 
            "barcode": "2600001324",
            "subtotal": 0
        },
        {
            "id": 2,
            "nombre": "Pan Dulce",
            "precio": 8,
            "cantidad": 0, 
            "barcode": "pd1234",
            "subtotal": 0
        }
    ];

function addProduct() {
    const barcode = barcodeInput.value.trim();
    if (barcode === '') return;

    const product = allProducts.find(p => p.barcode === barcode);

    if (product) {
        const existingProduct = productos.find(p => p.id === product.id);

        if (existingProduct) {
            //Si el producto ya esta en la tabla aumenta la cantidad en 1 y actualiza el subtotal
            existingProduct.cantidad += 1;
            existingProduct.subtotal = existingProduct.cantidad * existingProduct.precio;
        }else{
            //Si no existe se agrega a la tabla 
            productos.push({
                ...product,
                cantidad: 1,
                subtotal: product.precio
            });
        }
    }
    else
    {
        console.warn('Producto no encontrado');
            
    }
    barcodeInput.value = '';
}

const disminuirProducto = (product:Producto) => {
    if (product.cantidad > 1) {
        product.cantidad -= 1;
        product.subtotal = product.cantidad * product.precio;
    }else{
        const index = productos.findIndex(p => p.id == product.id);
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

const generarVenta = () => {
    //TODO Agregar logica para guardar venta y descontar cantidad en productos
    esGenerada.value = true;
}

const imprimirPdf = () =>{
    showModalPdf.value = true;
}

const terminar = () =>{
    console.log('terminar');
    //productos.value = [];
    isOpen.value = false;
    window.location.reload();
}

</script>

<style lang="scss" scoped>

</style>