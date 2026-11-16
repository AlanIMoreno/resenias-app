import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSnackbarStore = defineStore('snackbar', () => {
  const show = ref(false)
  const text = ref('')
  const color = ref('info')
  const timeout = ref(3000)

  function mostrar(mensaje, tipoColor = 'info', duracion = 3000) {
    text.value = mensaje
    color.value = tipoColor
    timeout.value = duracion
    show.value = true
  }

  return { show, text, color, timeout, mostrar }
})