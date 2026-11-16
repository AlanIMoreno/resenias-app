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

    <div class="text-center mb-8">

      <h1 class="text-h3 mb-3">
        👥 Gestión de usuarios
      </h1>

      <p class="text-medium-emphasis">
        Administración de roles y permisos de usuarios.
      </p>

    </div>

    <v-card elevation="6">

      <v-table>

        <thead>

          <tr>

            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>

          </tr>

        </thead>

        <tbody>

          <tr
            v-for="usuario in usuarios"
            :key="usuario.id"
          >

            <td>

              <div class="d-flex align-center">

                👤

                <span class="ml-2">
                  {{ usuario.email }}
                </span>

              </div>

            </td>

            <td>

              <v-chip
                :color="
                  usuario.rol === 'admin'
                    ? 'purple'
                    : 'green'
                "
              >
                {{ usuario.rol }}
              </v-chip>

            </td>

            <td>

              <v-btn
                v-if="usuario.rol === 'user'"
                color="primary"
                size="small"
                @click="
                  cambiarRol(
                    usuario.id,
                    'admin'
                  )
                "
              >
                Hacer admin
              </v-btn>

              <v-btn
                v-if="usuario.rol === 'admin'"
                color="warning"
                size="small"
                @click="
                  cambiarRol(
                    usuario.id,
                    'user'
                  )
                "
              >
                Quitar admin
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