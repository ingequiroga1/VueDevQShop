import { defineStore } from 'pinia'
import { Usuario } from '../interfaces/Auth'
import { mensaje, Proveedor } from '../interfaces/Proveedor';
import { crearProveedor, editarProveedor, eliminarProveedor, getProveedores } from '../services/ventas/proveedorService';
import { ProductoPeticion, ProductoRespuesta } from '../interfaces/Producto';
import { editarProducto, getProductoxProv } from '../services/ventas/productoService';


export const useprincipalStore = defineStore('principal', {
  state: () => ({
    user: null as Usuario | null,
    proveedores: [] as Proveedor[],
    loading: false,
    msgProveedores: null as mensaje | null,
    productosxproveedor: [] as ProductoRespuesta[],
    msgProductos: null as mensaje | null,
    showModalProductos: false,
    editingProduct: {
        nombre: '',
        descripcion: '',
        codigo_barras: '',
        stock: 0,
        precio_venta: 0,
        idproveedor: '',
        categorias: { categoria_id: 0, nombre: '' }
      } as ProductoRespuesta,
  }),
  actions: {
    async fetchProveedores() {
      this.loading = true;
      const response = await getProveedores('',1,50);
        if (response.success) {
      this.proveedores = response.data;
    } else {

      this.msgProveedores = {
        tipo: 'error',
        mensaje: response.error || 'Error al cargar los proveedores',
      }
    }
      this.loading = false;
    },
     async createProveedor(proveedor: Proveedor) {
      const response = await crearProveedor(proveedor);
      if(response.success){
        this.proveedores.unshift(response.data[0]);
      }
    },

    async updateProveedor(proveedor: Proveedor) {
      const response = await editarProveedor(proveedor);
      if (response.success) {
        const index = this.proveedores.findIndex(prov => prov.id === proveedor.id);
        if (index !== -1) {
          this.proveedores[index] = proveedor; // Actualiza el proveedor en la lista
        }
        this.msgProveedores = {
          tipo: 'success',
          mensaje: 'Proveedor actualizado correctamente',
        };
    }else {
        this.msgProveedores = {
          tipo: 'error',  
          mensaje: response.error || 'Error al actualizar el proveedor',
        }
      }
    },

    async deleteProveedor(idProv:string) {
      const response = await eliminarProveedor(idProv);
      if(response.success){
        this.proveedores = this.proveedores.filter(prov => prov.id !== idProv);
        this.msgProveedores = {
          tipo: 'success',
          mensaje: 'Proveedor eliminado correctamente',
        };
      }else{
        this.msgProveedores = {
          tipo: 'error',
          mensaje: response.error || 'Error al eliminar el proveedor',
     }
    }
    },

    //Productos
    // obtener productos por proveedor 
    async fetchProdxProv(idProveedor: string) {
      this.loading = true;
      const response = await getProductoxProv(idProveedor);
      
        if (response.success) {
      this.productosxproveedor = response.data;
    } else {

      this.msgProductos = {
        tipo: 'error',
        mensaje: response.error || 'Error al cargar los productos del proveedor',
      }
    }
      this.loading = false;
    },

    async abrirModalProductos(producto: ProductoPeticion) {
      this.showModalProductos = true;
      this.editingProduct = producto; // Asigna el producto a editar
    },

    async updateProducto() {
      this.loading = true;
      const producto: ProductoPeticion = {
        producto_id: this.editingProduct.producto_id,
        nombre: this.editingProduct.nombre,
        codigo_barras: this.editingProduct.codigo_barras,
        descripcion: this.editingProduct.descripcion,
        categorias: this.editingProduct.categorias,
        precio_venta: this.editingProduct.precio_venta,
        stock: this.editingProduct.stock,
        stock_minimo: this.editingProduct.stock_minimo,
        subtotal: 0, // Asignar un valor por defecto o calcularlo si es necesario
        cantidad: 0, // Asignar un valor por defecto o calcularlo si es necesario
        idproveedor: this.editingProduct.idproveedor || null, // Asegurarse de que idproveedor no sea undefined
      }
        const response = await editarProducto(producto);
       if (response.success) {
         const index = this.productosxproveedor.findIndex(prod => prod.producto_id === producto.producto_id);
         if (index !== -1) {
           this.productosxproveedor[index] = producto; // Actualiza el producto en la lista
         }
         this.msgProductos = {
           tipo: 'success',
           mensaje: 'Producto actualizado correctamente',
         };
       } else {
         this.msgProductos = {
           tipo: 'error',  
           mensaje: response.error || 'Error al actualizar el producto',
         }
       }
    },


   //User
    setUser(userData:any){
            this.user = userData;
        },
    
  },
  getters: {
    getProveedor: (state) => {
      return (id:string) => state.proveedores.find(prov => prov.id === id);
    } 
  },
  persist: true, // 🔥 esta línea activa la persistencia
})