<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../../lib/supabase'

const totalUsuarios = ref(0)
const totalPeliculas = ref(0)
const totalResenias = ref(0)
const totalAdmins = ref(0)

async function cargarIndicadores() {

  const { count: usuarios } =
    await supabase
      .from('profiles')
      .select('*', {
        count: 'exact',
        head: true
      })

  totalUsuarios.value =
    usuarios || 0

  const { count: peliculas } =
    await supabase
      .from('peliculas')
      .select('*', {
        count: 'exact',
        head: true
      })

  totalPeliculas.value =
    peliculas || 0

  const { count: resenias } =
    await supabase
      .from('reseñas')
      .select('*', {
        count: 'exact',
        head: true
      })

  totalResenias.value =
    resenias || 0

  const { count: admins } =
    await supabase
      .from('profiles')
      .select('*', {
        count: 'exact',
        head: true
      })
      .eq('rol', 'admin')

  totalAdmins.value =
    admins || 0

}

onMounted(() => {
  cargarIndicadores()
})
</script>
<template>

  <v-container>

    <div class="text-center mb-8">

      <h1 class="text-h3 mb-3">
        📊 Dashboard
      </h1>

      <p class="text-medium-emphasis">
        Resumen general de la plataforma.
      </p>

    </div>

    <v-row>

      <v-col
        cols="12"
        sm="6"
        md="3"
      >

        <v-card
          elevation="6"
          class="text-center pa-4"
        >

          <div class="text-h2 mb-2">
            👥
          </div>

          <div class="text-h5">
            {{ totalUsuarios }}
          </div>

          <div>
            Usuarios
          </div>

        </v-card>

      </v-col>

      <v-col
        cols="12"
        sm="6"
        md="3"
      >

        <v-card
          elevation="6"
          class="text-center pa-4"
        >

          <div class="text-h2 mb-2">
            🎬
          </div>

          <div class="text-h5">
            {{ totalPeliculas }}
          </div>

          <div>
            Películas
          </div>

        </v-card>

      </v-col>

      <v-col
        cols="12"
        sm="6"
        md="3"
      >

        <v-card
          elevation="6"
          class="text-center pa-4"
        >

          <div class="text-h2 mb-2">
            ⭐
          </div>

          <div class="text-h5">
            {{ totalResenias }}
          </div>

          <div>
            Reseñas
          </div>

        </v-card>

      </v-col>

      <v-col
        cols="12"
        sm="6"
        md="3"
      >

        <v-card
          elevation="6"
          class="text-center pa-4"
        >

          <div class="text-h2 mb-2">
            🛡️
          </div>

          <div class="text-h5">
            {{ totalAdmins }}
          </div>

          <div>
            Admins
          </div>

        </v-card>

      </v-col>

    </v-row>

  </v-container>

</template>
<style scoped>

.v-card {
  transition: 0.3s;
}

.v-card:hover {
  transform: translateY(-5px);
}

</style>