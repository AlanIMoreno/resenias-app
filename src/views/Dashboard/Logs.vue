<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../../lib/supabase'

const resenias = ref([])

async function cargarResenias() {

  const { data, error } =
    await supabase
      .from('reseñas')
      .select(`
        *,
        peliculas (
          titulo
        )
      `)
      .order('fecha', {
        ascending: false
      })

  if (error) {
    console.error(error)
    return
  }

  const reseniasConUsuario = await Promise.all(

    (data || []).map(async (resenia) => {

      const { data: profile } =
        await supabase
          .from('profiles')
          .select('email, rol')
          .eq('id', resenia.usuario_id)
          .single()

      return {
        ...resenia,
        profile
      }

    })

  )

  resenias.value = reseniasConUsuario

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

onMounted(() => {
  cargarResenias()
})
</script>
<template>

  <v-container>

    <div class="text-center mb-8">

      <h1 class="text-h3 mb-3">
        📝 Moderación de reseñas
      </h1>

      <p class="text-medium-emphasis">
        Gestiona y supervisa las reseñas publicadas por los usuarios.
      </p>

    </div>

    <v-card elevation="6">

      <v-table>

        <thead>

          <tr>

            <th>Usuario</th>
            <th>Película</th>
            <th>Rating</th>
            <th>Comentario</th>
            <th>Acciones</th>

          </tr>

        </thead>

        <tbody>

          <tr
            v-for="resenia in resenias"
            :key="resenia.id"
          >

            <td>

              <div class="d-flex align-center">

                👤

                <span class="ml-2">
                  {{ resenia.emailUsuario }}
                </span>

              </div>

            </td>

            <td>

              🎬
              {{ resenia.peliculas?.titulo }}

            </td>

            <td>

              <v-chip
                color="amber"
              >
                ⭐ {{ resenia.rating }}/5
              </v-chip>

            </td>

            <td>

              {{ resenia.comentario }}

            </td>

            <td>

              <v-btn
                color="error"
                size="small"
                @click="
                  eliminarResenia(
                    resenia.id
                  )
                "
              >
                Eliminar
              </v-btn>

            </td>

          </tr>

        </tbody>

      </v-table>

    </v-card>

  </v-container>


</template>
  <style scoped>

.v-card {
  border-radius: 12px;
}

</style>