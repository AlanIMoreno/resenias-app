<script setup>
import { onMounted } from 'vue'
import { useUsuariosStore } from '../stores/usuarios'

const usuariosStore = useUsuariosStore()

onMounted(() => {
  usuariosStore.cargarUsuarios()
})
</script>

<template>
  <v-container>
    <h2 class="text-h5 mb-4">Usuarios registrados</h2>

    <v-progress-linear v-if="usuariosStore.cargando" indeterminate color="primary" class="mb-4" />

    <v-list v-else lines="two" border rounded>
      <v-list-item
        v-for="u in usuariosStore.lista"
        :key="u.id"
        :title="u.nombre || 'Sin nombre'"
        :subtitle="`${u.email} • Rol: ${u.rol}`"
      >
        <template #append>
          <v-btn
            icon="mdi-delete"
            color="error"
            variant="text"
            size="small"
            @click="usuariosStore.eliminarUsuario(u.id)"
          />
        </template>
      </v-list-item>
    </v-list>
  </v-container>
</template>