import { defineStore } from "pinia";
import { Usuario } from "../interfaces/Auth";
import { mensaje, Proveedor } from "../interfaces/Proveedor";
import {
  crearProveedor,
  editarProveedor,
  eliminarProveedor,
  getProveedores,
} from "../services/ventas/proveedorService";
import { ProductoPeticion, ProductoRespuesta } from "../interfaces/Producto";
import {
  crearProducto,
  eliminarProducto,
  editarProducto,
  getProductos,
  getProductoxProv,
} from "../services/ventas/productoService";

export const useprincipalStore = defineStore("principal", {
  state: () => ({
    user: null as Usuario | null,
    proveedores: [] as Proveedor[],
    productos: [] as ProductoRespuesta[],
    numeroProductos: 0,
    loading: false,
    msgProveedores: null as mensaje | null,
    productosxproveedor: [] as ProductoRespuesta[],
    msgProductos: null as mensaje | null,
    showModalProductos: false,
    editingProduct: {
      nombre: "",
      descripcion: "",
      codigo_barras: "",
      stock: 0,
      precio_venta: 0,
      idproveedor: "",
      categorias: { categoria_id: 0, nombre: "" },
    } as ProductoRespuesta,
  }),
  getters: {
    getImagen: (state) =>
      `https://ui-avatars.com/api/?name=${state.user?.nombre}&background=0D8ABC&color=fff`,
    getProveedor: (state) => {
      return (id: string) => state.proveedores.find((prov) => prov.id === id);
    },
  },
  actions: {
    async fetchProveedores() {
      this.loading = true;
      const response = await getProveedores("", 1, 50);
      if (response.success) {
        this.proveedores = response.data;
      } else {
        this.msgProveedores = {
          tipo: "error",
          mensaje: response.error || "Error al cargar los proveedores",
        };
      }
      this.loading = false;
    },
    async createProveedor(proveedor: Proveedor) {
      const response = await crearProveedor(proveedor);
      if (response.success) {
        this.proveedores.unshift(response.data[0]);
      }
    },

    async updateProveedor(proveedor: Proveedor) {
      const response = await editarProveedor(proveedor);
      if (response.success) {
        const index = this.proveedores.findIndex(
          (prov) => prov.id === proveedor.id
        );
        if (index !== -1) {
          this.proveedores[index] = proveedor; // Actualiza el proveedor en la lista
        }
        this.msgProveedores = {
          tipo: "success",
          mensaje: "Proveedor actualizado correctamente",
        };
      } else {
        this.msgProveedores = {
          tipo: "error",
          mensaje: response.error || "Error al actualizar el proveedor",
        };
      }
    },

    async deleteProveedor(idProv: string) {
      const response = await eliminarProveedor(idProv);
      if (response.success) {
        this.proveedores = this.proveedores.filter(
          (prov) => prov.id !== idProv
        );
        this.msgProveedores = {
          tipo: "success",
          mensaje: "Proveedor eliminado correctamente",
        };
      } else {
        this.msgProveedores = {
          tipo: "error",
          mensaje: response.error || "Error al eliminar el proveedor",
        };
      }
    },

    //Productos
    async fetchProducts(
      busqueda: string,
      currentPage: number,
      pageSize: number
    ) {
      const response = await getProductos(busqueda, currentPage, pageSize);
      if (response.success) {
        this.numeroProductos = response.count || 0; // Actualiza el número total de productos
        this.productos = response.data;
      } else {
        this.msgProductos = {
          tipo: "error",
          mensaje: response.error || "Error al cargar los productos",
        };
      }
    },
    // obtener productos por proveedor
    async fetchProdxProv(idProveedor: string) {
      this.loading = true;
      const response = await getProductoxProv(idProveedor);

      if (response.success) {
        this.productosxproveedor = response.data;
      } else {
        this.msgProductos = {
          tipo: "error",
          mensaje:
            response.error || "Error al cargar los productos del proveedor",
        };
      }
      this.loading = false;
    },

    async abrirModalProductos(producto: ProductoPeticion) {
      this.showModalProductos = true;
      this.editingProduct = producto; // Asigna el producto a editar
    },

    async updateProducto(producto: ProductoPeticion) {
      this.loading = true;

      try {
        const response = await editarProducto(producto);

        if (response.success) {
          this.actualizarLista(this.productos, producto);
          this.actualizarLista(this.productosxproveedor, producto);

          this.msgProductos = {
            tipo: "success",
            mensaje: "Producto actualizado correctamente",
          };
        } else {
          this.msgProductos = {
            tipo: "error",
            mensaje: response.error || "Error al actualizar el producto",
          };
        }
      } catch (error) {
        this.msgProductos = {
          tipo: "error",
          mensaje: "Error inesperado al actualizar el producto",
        };
      } finally {
        this.loading = false;
      }
    },

    async addProducto(newProduct: ProductoPeticion) {
      this.loading = true;
      const response = await crearProducto(newProduct);
      if (response.success) {
        this.msgProductos = {
          tipo: "success",
          mensaje: "Producto creado correctamente",
        };
       this.productosxproveedor.unshift(response.data[0]);
       this.productos.unshift(response.data[0]); 
       // Agrega el nuevo producto al inicio de la lista
      } else {
        this.msgProductos = {
          tipo: "error",
          mensaje: "Error al agregar el producto",
        };
      }
      this.loading = false;
    },

    async deleteProducto(idProd: number) {
      this.loading = true;
      const response = await eliminarProducto(idProd);
      if (response.success) {
        this.productos = this.productos.filter(
          (prod) => prod.producto_id !== idProd
        );

        this.productosxproveedor = this.productosxproveedor.filter(
          (prod) => prod.producto_id !== idProd
        );
        this.msgProductos = {
          tipo: "success",
          mensaje: "Producto eliminado correctamente",
        };
      } else {
        this.msgProductos = {
          tipo: "error",
          mensaje: response.error || "Error al eliminar el producto",
        };
      }
      this.loading = false;
    },

    actualizarLista(lista: ProductoRespuesta[], producto: ProductoPeticion) {
      const index = lista.findIndex(
        (p) => p.producto_id === producto.producto_id
      );
      if (index !== -1) {
        lista[index] = producto;
      }
    },

    sanitizarProducto (producto: ProductoPeticion): ProductoPeticion {
      producto.nombre = producto.nombre
      .trim();
      producto.codigo_barras = producto.codigo_barras
      .trim();

      return producto;
    },

    //User
    setUser(userData: any) {
      this.user = userData;
    },
  },
  persist: true, // 🔥 esta línea activa la persistencia
});
