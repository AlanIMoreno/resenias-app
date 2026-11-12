<script setup>
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
</script>

<template>

  <v-container>

    <h1>Panel Administrador</h1>

    <p>
      Usuario:
      {{ authStore.profile?.email }}
    </p>

    <p>
      Rol:
      {{ authStore.profile?.rol }}
    </p>

  </v-container>

</template>
