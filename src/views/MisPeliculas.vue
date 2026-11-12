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

    <h1>
      Mis películas
    </h1>

    <v-row>

      <v-col
        v-for="item in peliculas"
        :key="item.peliculas.id"
        cols="12"
        md="4"
      >

        <v-card
          class="cursor-pointer"
          @click="
            abrirPelicula(
              item.peliculas.tmdb_id
            )
          "
        >

          <v-img
            :src="`https://image.tmdb.org/t/p/w500${item.peliculas.poster}`"
            height="350"
            cover
          />

          <v-card-title>
            {{ item.peliculas.titulo }}
          </v-card-title>

          <v-card-text>
            ⭐ {{ item.rating }}/5
          </v-card-text>

        </v-card>

      </v-col>

    </v-row>

  </v-container>

</template>