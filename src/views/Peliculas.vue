<script setup lang="js">
import { ref } from 'vue'
import { useTmdb } from '../composables/useTmdb'
import { useRouter } from 'vue-router'

const router = useRouter()

const { buscarPeliculas: buscarTmdb } = useTmdb()

const textoBusqueda = ref('')
const peliculas = ref([])

async function buscarPeliculas() {
  peliculas.value =
    await buscarTmdb(textoBusqueda.value)
}

function verDetalle(pelicula) {
  router.push(`/peliculas/${pelicula.id}`)
}
</script>

<template>
  <v-container>
    <h1>Películas</h1>

    <v-text-field
      v-model="textoBusqueda"
      label="Buscar película"
      variant="outlined"
    />

    <v-btn
      color="primary"
      @click="buscarPeliculas"
    >
      Buscar
    </v-btn>

    <v-row class="mt-4">
      <v-col
        v-for="pelicula in peliculas"
        :key="pelicula.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card>
          <v-img
            :src="`https://image.tmdb.org/t/p/w500${pelicula.poster_path}`"
            height="400"
            cover
          />

          <v-card-title>
            {{ pelicula.title }}
          </v-card-title>

          <v-card-subtitle>
            {{ pelicula.release_date }}
          </v-card-subtitle>

          <v-card-text>
            {{ pelicula.overview }}
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="primary"
              @click="verDetalle(pelicula)"
            >
              Ver detalle
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
