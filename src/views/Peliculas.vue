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
  <div class="peliculas-wrapper">
    <v-container class="py-8">
      <v-row
        justify="center"
        class="mb-8"
      >
        <v-col
          cols="12"
          md="10"
          lg="9"
        >
          <v-card
            elevation="12"
            class="pa-6 pa-md-8 search-card text-center"
          >
            <h1 class="text-h4 text-md-h3 font-weight-bold mb-2">
              🎬 Explorar películas
            </h1>

            <p class="text-body-1 text-medium-emphasis mb-6">
              Busca películas y consulta las reseñas de la comunidad.
            </p>

            <v-row
              justify="center"
              align="center"
            >
              <v-col
                cols="12"
                sm="8"
                md="8"
              >
                <v-text-field
                  v-model="textoBusqueda"
                  label="Buscar película"
                  variant="outlined"
                  hide-details
                  @keyup.enter="buscarPeliculas"
                />
              </v-col>

              <v-col
                cols="12"
                sm="4"
                md="3"
              >
                <v-btn
                  block
                  color="primary"
                  height="56"
                  class="font-weight-bold"
                  @click="buscarPeliculas"
                >
                  Buscar
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
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
            elevation="10"
            class="movie-card d-flex flex-column"
          >
            <v-img
              :src="pelicula.poster_path ? `https://image.tmdb.org/t/p/w500${pelicula.poster_path}` : ''"
              aspect-ratio="2/3"
              cover
              class="poster-img"
            />

            <v-card-title class="text-wrap font-weight-bold pt-3">
              {{ pelicula.title }}
            </v-card-title>

            <v-card-subtitle>
              📅 {{ pelicula.release_date }}
            </v-card-subtitle>

            <v-card-text class="flex-grow-1">
              <div class="mb-2 font-weight-medium">
                ⭐ TMDb: {{ pelicula.vote_average }}
              </div>

              <div class="overview text-medium-emphasis">
                {{ pelicula.overview }}
              </div>
            </v-card-text>

            <v-card-actions class="pa-4 pt-0 mt-auto">
              <v-btn
                block
                color="primary"
                variant="tonal"
                class="font-weight-bold"
                @click="verDetalle(pelicula)"
              >
                Ver detalle
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.peliculas-wrapper {
  min-height: calc(100vh - 64px);
  background-image:
    radial-gradient(circle at 50% 15%, rgba(245, 158, 11, 0.12), transparent 50%),
    linear-gradient(rgba(11, 14, 20, 0.84), rgba(11, 14, 20, 0.96)),
    url('https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: #F8FAFC;
}

.search-card {
  background: rgba(20, 25, 35, 0.82) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #F8FAFC !important;
}

.movie-card {
  height: 100%;
  background: rgba(20, 25, 35, 0.85) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #F8FAFC !important;
  overflow: hidden;
  transition: transform 0.25s ease, border-color 0.25s ease;
}

.movie-card:hover {
  transform: translateY(-5px);
  border-color: rgba(245, 158, 11, 0.45);
}

.poster-img {
  background-color: #141923;
}

.overview {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}
</style>