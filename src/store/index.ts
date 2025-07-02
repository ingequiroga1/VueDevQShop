import { defineStore } from 'pinia'
import { Usuario } from '../interfaces/Auth'
import { mensaje, Proveedor } from '../interfaces/Proveedor';
import { crearProveedor, editarProveedor, eliminarProveedor, getProveedores } from '../services/ventas/proveedorService';


export const useprincipalStore = defineStore('principal', {
  state: () => ({
    user: null as Usuario | null,
    proveedores: [] as Proveedor[],
    loading: false,
    msgProveedores: null as mensaje | null,
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

    setUser(userData:any){
            this.user = userData;
        },
    
  },
  persist: true, // 🔥 esta línea activa la persistencia
})