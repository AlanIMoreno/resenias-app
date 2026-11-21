<script setup>
import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/auth'
import { useGemini } from '../composables/useGemini'
import { useTmdb } from '../composables/useTmdb'

const authStore = useAuthStore()
const { analizarGustos } = useGemini()
const { obtenerRecomendaciones } = useTmdb()

const resultado = ref('')
const errorMsg = ref('')
const cargando = ref(false)
const recomendaciones = ref([])

async function generar() {
  if (!authStore.user?.id) {
    errorMsg.value = 'Debes iniciar sesión para analizar tus gustos.'
    return
  }

  cargando.value = true
  resultado.value = ''
  errorMsg.value = ''
  recomendaciones.value = []

  try {
    const { data, error } = await supabase
      .from('reseñas')
      .select(`
        rating,
        peliculas (
          titulo,
          tmdb_id
        )
      `)
      .eq('usuario_id', authStore.user.id)
      .gte('rating', 4)
      .order('rating', { ascending: false })

    if (error) throw error

    const reseñasValidas = (data || []).filter(r => r.peliculas?.titulo)

    if (reseñasValidas.length === 0) {
      errorMsg.value = 'Necesitas tener al menos una película reseñada con 4 o más estrellas.'
      return
    }

    const favoritas = reseñasValidas.map(
      r => `${r.peliculas.titulo} (${r.rating}/5)`
    )
    const favoritaPrincipal = reseñasValidas.find(
      r => r.peliculas?.tmdb_id
    )?.peliculas?.tmdb_id

    try {
      resultado.value = await analizarGustos(favoritas)
    } catch (geminiError) {
      console.error(geminiError)
      errorMsg.value = 'La IA no está disponible actualmente. Se intentarán recomendaciones basadas en TMDb.'

      if (!favoritaPrincipal) {
        errorMsg.value += ' No hay una película con ID de TMDb para generar recomendaciones.'
        return
      }

      try {
        const recomendadas = await obtenerRecomendaciones(favoritaPrincipal)
        recomendaciones.value = (recomendadas || []).slice(0, 3)
        if (recomendaciones.value.length === 0) {
          errorMsg.value += ' TMDb no encontró recomendaciones para esta película.'
        }
      } catch (tmdbError) {
        console.error(tmdbError)
        errorMsg.value = 'Gemini no está disponible y no se pudieron obtener recomendaciones de TMDb.'
      }
    }
  } catch (err) {
    console.error(err)
    errorMsg.value = 'Ocurrió un error al generar las recomendaciones. Intenta nuevamente.'
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <v-container>
    <h1>🤖 Recomendaciones IA</h1>
    <p>Analiza tus películas favoritas y obtiene recomendaciones personalizadas.</p>

    <v-btn color="primary" @click="generar" :loading="cargando">
      Analizar mis gustos
    </v-btn>

    <v-alert v-if="errorMsg" type="warning" class="mt-4">
      {{ errorMsg }}
    </v-alert>
<v-card
  v-if="resultado"
  class="mt-6 pa-6"
  elevation="4"
>


<v-card
  v-if="resultado"
  class="mt-6 pa-6"
  elevation="6"
  rounded="lg"
>
  <div class="d-flex align-center mb-4">
    <span class="text-h5">🤖</span>
    <span class="text-h5 ml-2">
      Análisis IA
    </span>
  </div>

  <v-divider class="mb-4" />

  <div class="resultado-ia">
    {{ resultado }}
  </div>
</v-card>

</v-card>
   <div
  v-if="recomendaciones.length"
  class="mt-6"
>

  <h2 class="mb-4">
    🎬 Recomendaciones para ti
  </h2>

  <v-row>

    <v-col
      v-for="movie in recomendaciones"
      :key="movie.id"
      cols="12"
      sm="6"
      md="3"
    >

      <v-card
        elevation="6"
      >

      <v-img
  :src="`https://image.tmdb.org/t/p/w342${movie.poster_path}`"
  height="280"
  contain
/>

        <v-card-title>
          {{ movie.title }}
        </v-card-title>

        <v-card-subtitle>
          ⭐ {{ movie.vote_average }}
        </v-card-subtitle>

      </v-card>

    </v-col>

  </v-row>

</div>
  </v-container>
</template>
<style scoped>

.ia-card {
  border-top: 5px solid #1976d2;
}

.resultado-ia {
  white-space: pre-wrap;
  line-height: 1.8;
  font-size: 1.05rem;
}

.recomendaciones-titulo {
  text-align: center;
  margin-bottom: 1rem;
}

</style>
