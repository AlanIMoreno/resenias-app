<script setup lang="js">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTmdb } from '../composables/useTmdb'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/auth'
import { useSnackbarStore } from '../stores/snackbar'

const authStore = useAuthStore()
const snackbar = useSnackbarStore()
const route = useRoute()

const pelicula = ref(null)
const peliculaDbId = ref(null)
const rating = ref(0)
const comentario = ref('')
const resenias = ref([])
const reseniaEditando = ref(null)

const promedioUsuarios = computed(() => {
  if (resenias.value.length === 0) {
    return 0
  }

  const suma = resenias.value.reduce(
    (acc, r) => acc + r.rating,
    0
  )

  return (
    suma / resenias.value.length
  ).toFixed(1)
})

// Fondo dinámico basado en el backdrop de la película de TMDb
const fondoDinamico = computed(() => {
  if (!pelicula.value?.backdrop_path) {
    return {
      background: 'radial-gradient(circle at top, #1e293b 0%, #121212 70%)'
    }
  }

  return {
    backgroundImage: `
      linear-gradient(to bottom, rgba(18, 18, 18, 0.68) 0%, rgba(18, 18, 18, 0.92) 45%, #121212 85%),
      url('https://image.tmdb.org/t/p/original${pelicula.value.backdrop_path}')
    `,
    backgroundSize: 'cover',
    backgroundPosition: 'center top',
    backgroundRepeat: 'no-repeat'
  }
})

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-AR')
}

const { obtenerPelicula } = useTmdb()

async function guardarPeliculaSiNoExiste() {
  const { data: existente, error: errorBusqueda } =
    await supabase
      .from('peliculas')
      .select('*')
      .eq('tmdb_id', pelicula.value.id)
      .maybeSingle()

  if (errorBusqueda) {
    console.error('Error al buscar película:', errorBusqueda)
    return
  }

  if (existente) {
    peliculaDbId.value = existente.id
    return
  }

  const { data, error } =
    await supabase
      .from('peliculas')
      .insert({
        tmdb_id: pelicula.value.id,
        titulo: pelicula.value.title,
        año: pelicula.value.release_date,
        poster: pelicula.value.poster_path
      })
      .select()
      .single()

  if (error) {
    console.error('Error al guardar película:', error)
    return
  }

  peliculaDbId.value = data.id
}

async function guardarResenia() {
  if (!authStore.user) {
    snackbar.mostrar('Debe iniciar sesión nuevamente', 'warning')
    return
  }

  if (rating.value === 0) {
    snackbar.mostrar('Seleccione una puntuación', 'error')
    return
  }

  if (!comentario.value.trim()) {
    snackbar.mostrar('Ingrese un comentario', 'error')
    return
  }

  if (reseniaEditando.value) {
    const { error } =
      await supabase
        .from('reseñas')
        .update({
          rating: rating.value,
          comentario: comentario.value
        })
        .eq('id', reseniaEditando.value.id)

    if (error) {
      console.error(error)
      snackbar.mostrar('Error al actualizar la reseña', 'error')
      return
    }

    await cargarResenias()
    comentario.value = ''
    rating.value = 0
    reseniaEditando.value = null
    snackbar.mostrar('Reseña actualizada correctamente', 'success')
    return
  }

  if (!peliculaDbId.value) {
    return
  }

  const reseniaExistente = resenias.value.find(
    r => r.usuario_id === authStore.user.id
  )

  if (reseniaExistente) {
    const { error } =
      await supabase
        .from('reseñas')
        .update({
          rating: rating.value,
          comentario: comentario.value
        })
        .eq('id', reseniaExistente.id)

    if (error) {
      console.error(error)
      snackbar.mostrar('Error al actualizar la reseña', 'error')
      return
    }

    snackbar.mostrar('Reseña actualizada correctamente', 'success')
  } else {
    const { error } =
      await supabase
        .from('reseñas')
        .insert({
          usuario_id: authStore.user.id,
          pelicula_id: peliculaDbId.value,
          rating: rating.value,
          comentario: comentario.value
        })

    if (error) {
      console.error(error)
      snackbar.mostrar('Error al guardar la reseña', 'error')
      return
    }

    snackbar.mostrar('Reseña guardada correctamente', 'success')
  }

  await cargarResenias()
  comentario.value = ''
  rating.value = 0
}

async function eliminarResenia(id) {
  const { error } =
    await supabase
      .from('reseñas')
      .delete()
      .eq('id', id)

  if (error) {
    console.error(error)
    snackbar.mostrar('Error al eliminar la reseña', 'error')
    return
  }

  snackbar.mostrar('Reseña eliminada', 'info')
  await cargarResenias()
}

function editarResenia(resenia) {
  reseniaEditando.value = resenia
  rating.value = resenia.rating
  comentario.value = resenia.comentario
}

async function cargarResenias() {
  if (!peliculaDbId.value) {
    return
  }

  const { data, error } =
    await supabase
      .from('reseñas')
      .select('*')
      .eq('pelicula_id', peliculaDbId.value)
      .order('fecha', { ascending: false })

  if (error) {
    console.error(error)
    return
  }

  const reseniasConUsuario = await Promise.all(
    (data || []).map(async (resenia) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('nombre, email')
        .eq('id', resenia.usuario_id)
        .maybeSingle()

      return {
        ...resenia,
        nombreUsuario:
          profile?.nombre ||
          profile?.email ||
          'Usuario anónimo'
      }
    })
  )

  resenias.value = reseniasConUsuario
}

onMounted(async () => {
  pelicula.value = await obtenerPelicula(route.params.id)
  await guardarPeliculaSiNoExiste()
  await cargarResenias()
})
</script>

<template>
  <div
    v-if="pelicula"
    class="detalle-wrapper"
    :style="fondoDinamico"
  >
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <v-img
            :src="`https://image.tmdb.org/t/p/w500${pelicula.poster_path}`"
            height="500"
            cover
            class="rounded-lg elevation-10"
          />
        </v-col>

        <v-col cols="12" md="8">
          <div class="mb-6">
            <h1 class="text-h3 mb-2">
              {{ pelicula.title }}
            </h1>

            <div class="text-medium-emphasis mb-2">
              📅 {{ pelicula.release_date }}
            </div>

            <div class="mb-2">
              ⭐ TMDb:
              {{ pelicula.vote_average }}
            </div>

            <div>
              👥 Usuarios:
              {{ promedioUsuarios }}
              ({{ resenias.length }} reseñas)
            </div>
          </div>

          <v-card
            class="pa-4 mb-6"
            elevation="4"
          >
            <h2 class="mb-4">
              Tu reseña
            </h2>

            <v-select
              v-model="rating"
              :items="[1,2,3,4,5]"
              label="Puntuación"
              variant="outlined"
            />

            <v-textarea
              v-model="comentario"
              label="Comentario"
              variant="outlined"
            />

            <v-btn
              color="success"
              @click="guardarResenia"
            >
              Guardar reseña
            </v-btn>
          </v-card>

          <h2 class="mb-4">
            Reseñas de usuarios
          </h2>

          <v-card
            v-for="resenia in resenias"
            :key="resenia.id"
            class="mb-4"
            elevation="3"
          >
            <v-card-text>
              <div class="mb-2">
                <strong>
                  {{ resenia.nombreUsuario }}
                </strong>
              </div>

              <div class="mb-2">
                ⭐ {{ resenia.rating }}/5
              </div>

              <p>
                {{ resenia.comentario }}
              </p>

              <small>
                {{ formatearFecha(resenia.fecha) }}
              </small>

              <div class="mt-3">
                <v-btn
                  v-if="
                    authStore.user &&
                    resenia.usuario_id === authStore.user.id
                  "
                  color="warning"
                  size="small"
                  class="mr-2"
                  @click="editarResenia(resenia)"
                >
                  Editar
                </v-btn>

                <v-btn
                  v-if="
                    authStore.user &&
                    resenia.usuario_id === authStore.user.id
                  "
                  color="error"
                  size="small"
                  @click="eliminarResenia(resenia.id)"
                >
                  Eliminar
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.login-wrapper {
  min-height: 90vh;
  background-image: 
    linear-gradient(rgba(18, 18, 24, 0.82), rgba(18, 18, 24, 0.94)),
    url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.login-container {
  min-height: 90vh;
}

.auth-card {
  background-color: rgba(28, 28, 36, 0.85) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
</style>