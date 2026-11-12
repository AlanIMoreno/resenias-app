<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../../lib/supabase'

const usuarios = ref([])

async function cargarUsuarios() {

  const { data, error } =
    await supabase
      .from('profiles')
      .select('*')
      .order('email')

  if (error) {
    console.error(error)
    return
  }

  usuarios.value = data || []

}

async function cambiarRol(
  id,
  nuevoRol
) {

  console.log('CAMBIANDO', id, nuevoRol)

  const { data, error } =
    await supabase
      .from('profiles')
      .update({
        rol: nuevoRol
      })
      .eq('id', id)
      .select()

  console.log('DATA', data)
  console.log('ERROR', error)

  if (error) {
    console.error(error)
    alert(error.message)
    return
  }

  await cargarUsuarios()

}

onMounted(() => {
  cargarUsuarios()
})
</script>

<template>

  <v-container>

    <h1>
      Administración de usuarios
    </h1>

    <v-table>

      <thead>

        <tr>

          <th>Email</th>
          <th>Rol</th>
          <th></th>

        </tr>

      </thead>

      <tbody>

        <tr
          v-for="usuario in usuarios"
          :key="usuario.id"
        >

          <td>
            {{ usuario.email }}
          </td>

          <td>
            {{ usuario.rol }}
          </td>

          <td>

            <v-btn
              v-if="usuario.rol === 'user'"
              color="primary"
              size="small"
              @click="cambiarRol(
                usuario.id,
                'admin'
              )"
            >
              Hacer admin
            </v-btn>

            <v-btn
              v-if="usuario.rol === 'admin'"
              color="warning"
              size="small"
              @click="cambiarRol(
                usuario.id,
                'user'
              )"
            >
              Quitar admin
            </v-btn>

          </td>

        </tr>

      </tbody>

    </v-table>

  </v-container>

</template>