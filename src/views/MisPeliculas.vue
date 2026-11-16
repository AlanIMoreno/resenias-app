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

  <v-container>

    <div class="text-center mb-8">

      <h1 class="text-h3 mb-3">
        🎞 Mis películas
      </h1>

      <p class="text-medium-emphasis">
        Películas que has reseñado y que puedes volver a consultar o modificar.
      </p>

    </div>

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
          class="movie-card"
          elevation="6"
          @click="
            abrirPelicula(
              item.peliculas.tmdb_id
            )
          "
        >

          <v-img
            :src="`https://image.tmdb.org/t/p/w500${item.peliculas.poster}`"
            height="400"
            cover
          />

          <v-card-title
            class="text-wrap"
          >
            {{ item.peliculas.titulo }}
          </v-card-title>

          <v-card-text>

            <div class="mb-2">
              Tu puntuación:
            </div>

            <div class="text-h6">
              ⭐ {{ item.rating }}/5
            </div>

          </v-card-text>

          <v-card-actions>

            <v-btn
              block
              color="primary"
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
  cursor: pointer;
  transition: 0.3s;
  height: 100%;
}

.movie-card:hover {
  transform: translateY(-5px);
}

</style>