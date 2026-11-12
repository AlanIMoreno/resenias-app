import { defineStore } from 'pinia'

export const useUsuariosStore = defineStore('usuarios', {
  state: () => ({
    lista: [] as any[],
    cargando: false
  }),
  actions: {
    async cargarUsuarios() {
      this.cargando = true
      // acá después conectamos con Supabase
      this.lista = [
        { id: 1, nombre: 'Alan' },
        { id: 2, nombre: 'María' }
      ]
      this.cargando = false
    },
    agregarUsuario(usuario) {
      this.lista.push(usuario)
    },
    eliminarUsuario(id) {
      this.lista = this.lista.filter(u => u.id !== id)
    }
  }
})
