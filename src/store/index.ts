import { defineStore } from 'pinia'
import { Usuario } from '../interfaces/Auth'
import { Proveedor } from '../interfaces/Proveedor';
import { crearProveedor, eliminarProveedor, getProveedores } from '../services/ventas/proveedorService';


export const useprincipalStore = defineStore('principal', {
  state: () => ({
    user: null as Usuario | null,
    proveedores: [] as Proveedor[],
    loading: false,
    errorProveedores: null as string | null,
  }),
  actions: {
    async fetchProveedores() {
      this.loading = true;
      const response = await getProveedores('',1,50);
        if (response.success) {
        console.log('Proveedores cargados:', response.data);
      this.proveedores = response.data;
    } else {
    console.log('Error al cargar proveedores:', response.error);
    }
      this.loading = false;
    },

    async createProveedor(proveedor: Proveedor) {
      const response = await crearProveedor(proveedor);
      if(response.success){
        this.proveedores.unshift(response.data[0]);
      }
    },

    async deleteProveedor(idProv:string) {
      const response = await eliminarProveedor(idProv);
      if(response.success){
        this.proveedores = this.proveedores.filter(prov => prov.id !== idProv);
      }
    },

    setUser(userData:any){
            this.user = userData;
        },
    
  },
  persist: true, // 🔥 esta línea activa la persistencia
})