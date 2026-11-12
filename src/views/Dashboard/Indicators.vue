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

    <h1>
      Indicadores
    </h1>

    <v-row>

      <v-col
        cols="12"
        md="3"
      >
        <v-card>
          <v-card-title>
            Usuarios
          </v-card-title>

          <v-card-text>
            {{ totalUsuarios }}
          </v-card-text>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        md="3"
      >
        <v-card>
          <v-card-title>
            Películas
          </v-card-title>

          <v-card-text>
            {{ totalPeliculas }}
          </v-card-text>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        md="3"
      >
        <v-card>
          <v-card-title>
            Reseñas
          </v-card-title>

          <v-card-text>
            {{ totalResenias }}
          </v-card-text>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        md="3"
      >
        <v-card>
          <v-card-title>
            Administradores
          </v-card-title>

          <v-card-text>
            {{ totalAdmins }}
          </v-card-text>
        </v-card>
      </v-col>

    </v-row>

  </v-container>

</template>