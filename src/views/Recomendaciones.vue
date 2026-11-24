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
  <div class="ia-wrapper">
    <v-container class="py-8">
      <v-row justify="center">
        <v-col
          cols="12"
          md="10"
          lg="9"
        >
          <v-card
            elevation="12"
            class="pa-6 pa-md-8 ia-header-card"
          >
            <h1 class="text-h4 font-weight-bold mb-2">
              🤖 Recomendaciones IA
            </h1>

            <p class="text-body-1 text-medium-emphasis mb-6">
              Analiza tus películas favoritas y obtiene recomendaciones personalizadas.
            </p>

            <v-btn
              color="primary"
              size="large"
              class="font-weight-bold px-6"
              :loading="cargando"
              @click="generar"
            >
              Analizar mis gustos
            </v-btn>

            <v-alert
              v-if="errorMsg"
              type="warning"
              variant="tonal"
              class="mt-6"
            >
              {{ errorMsg }}
            </v-alert>
          </v-card>

          <v-card
            v-if="resultado"
            elevation="12"
            class="mt-6 pa-6 pa-md-8 ia-result-card"
          >
            <div class="d-flex align-center mb-4">
              <span class="text-h5">🤖</span>
              <span class="text-h5 font-weight-bold ml-2">
                Análisis IA
              </span>
            </div>

            <v-divider class="mb-5" />

            <div class="resultado-ia">
              {{ resultado }}
            </div>
          </v-card>

          <div
            v-if="recomendaciones.length"
            class="mt-8"
          >
            <h2 class="text-h5 font-weight-bold mb-4">
              🎬 Recomendaciones para ti
            </h2>

            <v-row>
              <v-col
                v-for="movie in recomendaciones"
                :key="movie.id"
                cols="12"
                sm="6"
                md="4"
              >
                <v-card
                  elevation="10"
                  class="movie-card h-100"
                >
                  <v-img
                    :src="movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''"
                    aspect-ratio="2/3"
                    cover
                  />

                  <v-card-title class="pt-3 font-weight-bold">
                    {{ movie.title }}
                  </v-card-title>

                  <v-card-subtitle class="pb-4">
                    ⭐ {{ movie.vote_average }}
                  </v-card-subtitle>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.ia-wrapper {
  min-height: calc(100vh - 64px);
  background-image:
    radial-gradient(circle at 20% 20%, rgba(245, 158, 11, 0.14), transparent 45%),
    radial-gradient(circle at 80% 30%, rgba(56, 189, 248, 0.1), transparent 45%),
    linear-gradient(rgba(11, 14, 20, 0.85), rgba(11, 14, 20, 0.96)),
    url('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: #F8FAFC;
}

.ia-header-card {
  background: rgba(20, 25, 35, 0.82) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #F8FAFC !important;
}

.ia-result-card {
  background: rgba(20, 25, 35, 0.88) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-top: 4px solid #F59E0B;
  color: #F8FAFC !important;
}

.resultado-ia {
  white-space: pre-wrap;
  line-height: 1.85;
  font-size: 1.12rem;
  font-weight: 400;
  letter-spacing: 0.2px;
  color: #E2E8F0;
}

.movie-card {
  background: rgba(20, 25, 35, 0.85) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #F8FAFC !important;
  overflow: hidden;
  transition: transform 0.25s ease, border-color 0.25s ease;
}

.movie-card:hover {
  transform: translateY(-4px);
  border-color: rgba(245, 158, 11, 0.45);
}
</style>