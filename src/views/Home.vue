<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const estaLogueado = computed(() => {
  return !!authStore.user
})

function irLogin() {
  router.push('/login')
}

function irRegistro() {
  router.push('/register')
}

function irPeliculas() {
  router.push('/peliculas')
}
</script>

<template>

  <v-container
    fluid
    class="home-container"
  >

    <v-row
      justify="center"
      align="center"
      class="fill-height"
    >

      <v-col
        cols="12"
        md="8"
        lg="6"
      >

        <v-card
          class="pa-8 text-center"
          elevation="8"
        >

          <h1 class="text-h3 mb-4">
            Reseñas de Películas
          </h1>

          <p class="text-h6 mb-6">
            Descubre películas, consulta opiniones
            y comparte tus propias reseñas.
          </p>

         <div
  v-if="!estaLogueado"
  class="d-flex justify-center ga-4"
>

  <v-btn
    color="primary"
    size="large"
    @click="irLogin"
  >
    Iniciar sesión
  </v-btn>

  <v-btn
    color="success"
    size="large"
    @click="irRegistro"
  >
    Registrarse
  </v-btn>

</div>

<div
  v-else
  class="d-flex justify-center"
>

  <v-btn
    color="primary"
    size="large"
    @click="irPeliculas"
  >
    Ir a películas
  </v-btn>

</div>

        </v-card>

      </v-col>

    </v-row>

  </v-container>

</template>

<style scoped>

.home-container {
  min-height: 100vh;
  background: #f5f5f5;
}

</style>