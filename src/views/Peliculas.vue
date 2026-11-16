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

    <div class="text-center mb-8">

      <h1 class="text-h3 mb-3">
        🎬 Explorar películas
      </h1>

      <p class="text-medium-emphasis">
        Busca películas y consulta las reseñas de la comunidad.
      </p>

    </div>

    <v-row
      justify="center"
      class="mb-6"
    >

      <v-col
        cols="12"
        md="8"
      >

        <v-text-field
          v-model="textoBusqueda"
          label="Buscar película"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          @keyup.enter="buscarPeliculas"
        />

      </v-col>

      <v-col
        cols="12"
        md="2"
      >

        <v-btn
          block
          color="primary"
          size="large"
          @click="buscarPeliculas"
        >
          Buscar
        </v-btn>

      </v-col>

    </v-row>

    <v-row>

      <v-col
        v-for="pelicula in peliculas"
        :key="pelicula.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >

        <v-card
          elevation="6"
          class="movie-card"
        >

          <v-img
            :src="`https://image.tmdb.org/t/p/w500${pelicula.poster_path}`"
            height="400"
            cover
          />

          <v-card-title class="text-wrap">
            {{ pelicula.title }}
          </v-card-title>

          <v-card-subtitle>
            📅 {{ pelicula.release_date }}
          </v-card-subtitle>

          <v-card-text>

            <div class="mb-2">
              ⭐ TMDb:
              {{ pelicula.vote_average }}
            </div>

            <div class="overview">
              {{ pelicula.overview }}
            </div>

          </v-card-text>

          <v-card-actions>

            <v-btn
              block
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
<style scoped>

.movie-card {
  height: 100%;
  transition: 0.3s;
}

.movie-card:hover {
  transform: translateY(-5px);
}

.overview {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

</style>