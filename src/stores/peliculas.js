import { defineStore } from 'pinia'

export const usePeliculasStore = defineStore(
  'peliculas',
  {

    state: () => ({
      peliculaSeleccionada: null as any
    }),

    actions: {

      seleccionarPelicula(
        pelicula: any
      ) {

        this.peliculaSeleccionada =
          pelicula

      }

    }

  }
)