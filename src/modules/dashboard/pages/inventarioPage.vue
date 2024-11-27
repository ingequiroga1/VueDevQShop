<template>
    <div class="container mx-auto">
        <Alert 
        :type="alertType" 
        :message="alertMessage"
        :isVisible="showAlert" 
        dismissible 
        @close="handleClose"
        v-show="showAlert"
        />
    </div>
    <loadingSpinner :isLoading="isLoading" />
    <Inventory 
        :products="products"
        @update-product="updateProduct"
        @add-product="addProduct"
        @delete-product="deleteProduct"
      />
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import Inventory from '../../dashboard/components/inventario.vue';
import {crearProducto, deleteProducto, editarProducto, getProductos} from '../../../services/ventas/productoService.ts';
import { ProductoPeticion, ProductoRespuesta } from '../../../interfaces/Producto.ts';
import Alert from '../../common/components/alertComponent.vue'
import loadingSpinner from '../../common/components/loadingSpinner.vue';


const products = ref<ProductoRespuesta[]>([]);
const showAlert = ref(false);
const alertMessage = ref<string>('');
const alertType = ref<'success'|'error'|'warning'|'info'>('info');
const isLoading = ref(false)

onMounted(() => {
    onLoadProducts();
});

const onLoadProducts = async () => {
    isLoading.value = true
    const response = await getProductos()
    isLoading.value = false

     if (!response.success) {
         alertType.value = 'error'
         showAlert.value = true
         alertMessage.value = `Error al cargar los productos: ${response.error}`;
     }else{
         products.value = response.data;
     }
}

const addProduct = async (newProduct:ProductoPeticion) =>{
    const response = await crearProducto(newProduct);
    if (!response.success) {
        alertType.value = 'error'
        showAlert.value = true
        alertMessage.value = `Error al crear el producto: ${response.error}`;
    }
    else
    {
        alertType.value = 'success'
        showAlert.value = true
        alertMessage.value = `Se agrego el nuevo producto`;
        products.value.push(response.data[0])
    }
    
}

const deleteProduct = async (idProd:number) =>{
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

const updateProduct = async (editProduct:ProductoPeticion) =>{
    const response = await editarProducto(editProduct);
    if (!response.success) {
        alertType.value = 'error'
        showAlert.value = true
        alertMessage.value = `Error al actualizar: ${response.error}`;
    }
   
        const index =products.value.findIndex(
            product => product.producto_id === editProduct.producto_id
        );

        if(index !== -1){
            products.value[index] = {...products.value[index], ...editProduct};
        }else{
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



</script>

