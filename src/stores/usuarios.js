import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useUsuariosStore = defineStore('usuarios', {
  state: () => ({
    lista: [],
    cargando: false
  }),
  actions: {
    async cargarUsuarios() {
      this.cargando = true
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('creado_en', { ascending: false })

      if (!error && data) {
        this.lista = data
      }
      this.cargando = false
    },
    async eliminarUsuario(id) {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id)

      if (!error) {
        this.lista = this.lista.filter(u => u.id !== id)
      }
    }
  }
})