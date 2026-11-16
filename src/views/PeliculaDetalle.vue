<script setup lang="js">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTmdb } from '../composables/useTmdb'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/auth'
const authStore = useAuthStore()
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
function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-AR')
}
const { obtenerPelicula } = useTmdb()
async function guardarPeliculaSiNoExiste() {

  // 1. Buscar si la película ya existe
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

  // 2. Si existe, recuperar su ID
  if (existente) {

    peliculaDbId.value = existente.id

    console.log('Película ya existe:', existente)

    return
  }

  // 3. Si no existe, insertarla
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

  // 4. Verificar errores de inserción
  if (error) {
    console.error('Error al guardar película:', error)
    return
  }

  // 5. Guardar el ID generado por Supabase
  peliculaDbId.value = data.id

  console.log('Película guardada:', data)
}
async function guardarResenia() {
if (!authStore.user) {
  alert('Debe iniciar sesión nuevamente')
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
      .eq(
        'id',
        reseniaEditando.value.id
      )

  if (error) {
    console.error(error)
    return
  }

  await cargarResenias()

  comentario.value = ''
  rating.value = 0
  reseniaEditando.value = null

  return
}
  if (rating.value === 0) {
    alert('Seleccione una puntuación')
    return
  }

  if (!comentario.value.trim()) {
    alert('Ingrese un comentario')
    return
  }
  if (!peliculaDbId.value) {
    return
  }

console.log('USER', authStore.user)
console.log('PROFILE', authStore.profile)

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
    return
  }

  console.log('Reseña actualizada')

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
    return
  }

  console.log('Reseña guardada')

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
    return
  }

  await cargarResenias()

}
function editarResenia(resenia) {

  reseniaEditando.value = resenia

  rating.value = resenia.rating

  comentario.value =
    resenia.comentario

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

  const reseniasConEmail = await Promise.all(

    (data || []).map(async (resenia) => {

      const {
        data: profile,
        error: errorProfile
      } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', resenia.usuario_id)
        .maybeSingle()
console.log(
  'UUID:',
  resenia.usuario_id,
  'PROFILE:',
  profile,
  'ERROR:',
  errorProfile
)
      console.log(
        'RESEÑA:',
        resenia.usuario_id,
        'PROFILE:',
        profile,
        'ERROR:',
        errorProfile
      )

      return {
        ...resenia,
        emailUsuario:
          profile?.email ??
          resenia.usuario_id
      }

    })

  )

  resenias.value = reseniasConEmail

  console.log(resenias.value)

}

onMounted(async () => {

  pelicula.value =
  await obtenerPelicula(
     route.params.id
  )

await guardarPeliculaSiNoExiste()
await cargarResenias()
})
</script>

<template>

  <v-container v-if="pelicula">

    <v-row>

      <v-col cols="12" md="4">

        <v-img
          :src="`https://image.tmdb.org/t/p/w500${pelicula.poster_path}`"
          height="500"
          cover
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
          {{ resenia.emailUsuario }}
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

</template>