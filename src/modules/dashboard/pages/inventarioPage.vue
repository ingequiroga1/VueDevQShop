<template>
    <div class="container mx-auto">
        <Alert :type="alertType" :message="alertMessage" :isVisible="showAlert" dismissible @close="handleClose"
            v-show="showAlert" />

        <loadingSpinner :isLoading="isLoading" />
        <Inventory :products="principalStore.productos" :totalProducts="principalStore.numeroProductos" 
        @filtrar-product="filtrarProducts"
            @editar-producto="abrirModalEditar"
            @add-producto="abrirModalAdd"
            @cambiar-pagina="cambiarPagina" />

        <ModalProductos 
        :visible="ModalVisible"
        :productoEditar="productoSeleccionado"
        @cerrar="cerrarModal" 
        />
    </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Inventory from '../../dashboard/components/inventario.vue';
import ModalProductos from '../../dashboard/components/modalProductos.vue';
import { crearProducto, deleteProducto, editarProducto } from '../../../services/ventas/productoService.ts';
import { ProductoPeticion, ProductoRespuesta } from '../../../interfaces/Producto.ts';
import Alert from '../../common/components/alertComponent.vue'
import loadingSpinner from '../../common/components/loadingSpinner.vue';
import { useprincipalStore } from '../../../store/index.ts';

const principalStore = useprincipalStore();

const products = ref<ProductoRespuesta[]>([]);
const showAlert = ref(false);
const alertMessage = ref<string>('');
const alertType = ref<'success' | 'error' | 'warning' | 'info'>('info');
const isLoading = ref(false)
const searchQuery = ref<string>('');


const ModalVisible = ref(false);
const productoSeleccionado = ref<ProductoPeticion>({
    producto_id: 0,
    nombre: '',
    descripcion: '',
    codigo_barras: '',
    stock: 0,
    stock_minimo: 0,
    precio_venta: 0,
    idproveedor: '',
    categorias: { categoria_id: 0, nombre: '' },
    subtotal: 0,
    cantidad: 0,
});

const cerrarModal = () => {
    ModalVisible.value = false;
}

const abrirModalEditar = (producto: ProductoPeticion) => {
    productoSeleccionado.value = { ...producto };
    ModalVisible.value = true;
}

const abrirModalAdd = () => {
    ModalVisible.value = true;
}


onMounted(() => {
    onLoadProducts('', 1, 50);
});

const onLoadProducts = async (busqueda: string, cuerrentPage: number, pageSize: number) => {
    isLoading.value = true
    await  principalStore.fetchProducts(busqueda, cuerrentPage, pageSize);
    isLoading.value = false
}

const addProduct = async (newProduct: ProductoPeticion) => {
    const response = await crearProducto(newProduct);
    if (!response.success) {
        alertType.value = 'error'
        showAlert.value = true
        alertMessage.value = `Error al crear el producto: ${response.error}`;
    }
    else {
        alertType.value = 'success'
        showAlert.value = true
        alertMessage.value = `Se agrego el nuevo producto`;
        products.value.push(response.data[0])
    }

}

const deleteProduct = async (idProd: number) => {
    const response = await deleteProducto(idProd);
    if (!response.success) {
        alertType.value = 'error'
        showAlert.value = true
        alertMessage.value = `Error al eliminar producto: ${response.error}`;
    }

    alertType.value = 'success'
    showAlert.value = true
    alertMessage.value = "Se elimino el producto";
    products.value = products.value.filter(producto => producto.producto_id !== idProd);

}

const updateProduct = async (editProduct: ProductoPeticion) => {
    const response = await editarProducto(editProduct);
    if (!response.success) {
        alertType.value = 'error'
        showAlert.value = true
        alertMessage.value = `Error al actualizar: ${response.error}`;
    }

    const index = products.value.findIndex(
        product => product.producto_id === editProduct.producto_id
    );

    if (index !== -1) {
        products.value[index] = { ...products.value[index], ...editProduct };
    } else {
        alertType.value = 'error'
        showAlert.value = true
        alertMessage.value = `Error no se encontro el producto`;
    }

    alertType.value = 'success'
    showAlert.value = true
    alertMessage.value = `Se actualizo el producto: ${editProduct.nombre}`;

}

const handleClose = () => {
    showAlert.value = false;
};

const cambiarPagina = (pagina: number) => {
    onLoadProducts(searchQuery.value, pagina, 50);
}

const filtrarProducts = (query: string) => {
    searchQuery.value = query;
    onLoadProducts(query, 1, 50);
}




</script>
