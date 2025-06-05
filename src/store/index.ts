import { defineStore } from 'pinia'
import { Usuario } from '../interfaces/Auth'

export const useprincipalStore = defineStore('principal', {
  state: () => ({
    user: null as Usuario | null,
  }),
  actions: {
    setUser(userData:any){
            this.user = userData;
        },
  }
})