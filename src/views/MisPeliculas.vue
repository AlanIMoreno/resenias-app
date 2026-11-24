<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const peliculas = ref([])

async function cargarMisPeliculas() {

  const { data, error } =
    await supabase
      .from('reseñas')
      .select(`
        rating,
        peliculas (
          id,
          tmdb_id,
          titulo,
          poster
        )
      `)
      .eq(
        'usuario_id',
        authStore.user.id
      )

  if (error) {
    console.error(error)
    return
  }

  peliculas.value = data || []

}

function abrirPelicula(tmdbId) {

  router.push(
    `/peliculas/${tmdbId}`
  )

}

onMounted(() => {
  cargarMisPeliculas()
})
</script>
<template>
  <div class="mis-peliculas-wrapper">
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
            class="pa-6 pa-md-8 header-card text-center"
          >
            <h1 class="text-h4 text-md-h3 font-weight-bold mb-2">
              🎞 Mis películas
            </h1>

            <p class="text-body-1 text-medium-emphasis mb-0">
              Películas que has reseñado y que puedes volver a consultar o modificar.
            </p>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          v-for="item in peliculas"
          :key="item.peliculas.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card
            elevation="10"
            class="movie-card d-flex flex-column"
            @click="abrirPelicula(item.peliculas.tmdb_id)"
          >
            <v-img
              :src="item.peliculas.poster ? `https://image.tmdb.org/t/p/w500${item.peliculas.poster}` : ''"
              aspect-ratio="2/3"
              cover
              class="poster-img"
            />

            <v-card-title class="text-wrap font-weight-bold pt-3">
              {{ item.peliculas.titulo }}
            </v-card-title>

            <v-card-text class="flex-grow-1">
              <div class="text-body-2 text-medium-emphasis mb-1">
                Tu puntuación:
              </div>

              <div class="text-h6 font-weight-bold text-primary">
                ⭐ {{ item.rating }}/5
              </div>
            </v-card-text>

            <v-card-actions class="pa-4 pt-0 mt-auto">
              <v-btn
                block
                color="primary"
                variant="tonal"
                class="font-weight-bold"
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
.mis-peliculas-wrapper {
  min-height: calc(100vh - 64px);
  background-image:
    radial-gradient(circle at 50% 15%, rgba(245, 158, 11, 0.12), transparent 50%),
    linear-gradient(rgba(11, 14, 20, 0.85), rgba(11, 14, 20, 0.96)),
    url('https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: #F8FAFC;
}

.header-card {
  background: rgba(20, 25, 35, 0.82) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #F8FAFC !important;
}

.movie-card {
  cursor: pointer;
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
</style>