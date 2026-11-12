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

    <h1>
      Moderación de reseñas
    </h1>

    <v-table>

      <thead>

        <tr>
          <th>Usuario</th>
          <th>Película</th>
          <th>Rating</th>
          <th>Comentario</th>
          <th></th>
        </tr>

      </thead>

      <tbody>

        <tr
          v-for="resenia in resenias"
          :key="resenia.id"
        >

          <td>
       {{ resenia.profile?.email }}
          </td>

          <td>
            {{ resenia.peliculas?.titulo }}
          </td>

          <td>
            {{ resenia.rating }}
          </td>

          <td>
            {{ resenia.comentario }}
          </td>
          <td>

            <v-btn
              color="error"
              size="small"
              @click="eliminarResenia(resenia.id)"
            >
              Eliminar
            </v-btn>

          </td>

        </tr>

      </tbody>

    </v-table>

  </v-container>

</template>