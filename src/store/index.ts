import { defineStore } from 'pinia'
import { Usuario } from '../interfaces/Auth'

export const useprincipalStore = defineStore('principal', {
  state: () => ({
    user: null as Usuario | null,
  }),
  getters: {
    getImagen: (state) =>`https://ui-avatars.com/api/?name=${state.user?.nombre}&background=0D8ABC&color=fff`,
  },
  actions: {
    setUser(userData:any){
            this.user = userData;
        },
  },
  persist: true, // 🔥 esta línea activa la persistencia
})