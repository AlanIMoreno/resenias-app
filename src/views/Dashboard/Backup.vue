<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../../lib/supabase'
import { useSnackbarStore } from '../../stores/snackbar'

const snackbar = useSnackbarStore()
const usuarios = ref([])

async function cargarUsuarios() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('email')

  if (error) {
    console.error(error)
    snackbar.mostrar('Error al cargar los usuarios', 'error')
    return
  }

  usuarios.value = data || []
}

async function cambiarRol(id, nuevoRol) {
  const { error } = await supabase
    .from('profiles')
    .update({ rol: nuevoRol })
    .eq('id', id)

  if (error) {
    console.error(error)
    snackbar.mostrar('Error al cambiar el rol: ' + error.message, 'error')
    return
  }

  snackbar.mostrar(`Rol actualizado a ${nuevoRol}`, 'success')
  await cargarUsuarios()
}

onMounted(() => {
  cargarUsuarios()
})
</script>

<template>
  <v-container class="py-6">
    <div class="text-center mb-8">
      <h1 class="text-h4 font-weight-bold mb-2">
        👥 Gestión de usuarios
      </h1>
      <p class="text-medium-emphasis">
        Administración de roles y permisos de la comunidad.
      </p>
    </div>

    <v-card
      elevation="6"
      rounded="xl"
      class="users-card"
    >
      <v-table hover>
        <thead>
          <tr>
            <th class="text-left">Usuario</th>
            <th class="text-left">Correo electrónico</th>
            <th class="text-left">Rol</th>
            <th class="text-right">Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="usuario in usuarios"
            :key="usuario.id"
          >
            <td>
              <div class="d-flex align-center py-2">
                <v-avatar
                  size="32"
                  :color="usuario.rol === 'admin' ? 'purple-darken-3' : 'grey-darken-3'"
                  class="mr-3"
                >
                  <v-icon size="18">mdi-account</v-icon>
                </v-avatar>
                <span class="font-weight-medium">
                  {{ usuario.nombre || 'Sin nombre' }}
                </span>
              </div>
            </td>

            <td class="text-medium-emphasis">
              {{ usuario.email }}
            </td>

            <td>
              <v-chip
                size="small"
                variant="tonal"
                :color="usuario.rol === 'admin' ? 'purple-accent-2' : 'teal-accent-3'"
                :prepend-icon="usuario.rol === 'admin' ? 'mdi-shield-crown' : 'mdi-account-outline'"
              >
                {{ usuario.rol }}
              </v-chip>
            </td>

            <td class="text-right">
              <v-btn
                v-if="usuario.rol === 'user'"
                color="primary"
                variant="tonal"
                size="small"
                prepend-icon="mdi-arrow-up-bold-circle-outline"
                @click="cambiarRol(usuario.id, 'admin')"
              >
                Hacer admin
              </v-btn>

              <v-btn
                v-if="usuario.rol === 'admin'"
                color="warning"
                variant="tonal"
                size="small"
                prepend-icon="mdi-arrow-down-bold-circle-outline"
                @click="cambiarRol(usuario.id, 'user')"
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
.users-card {
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
}
</style>