<script setup>
import { ref, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
)
import { supabase } from '../../lib/supabase'

const totalUsuarios = ref(0)
const totalPeliculas = ref(0)
const totalResenias = ref(0)
const totalAdmins = ref(0)
const peliculasMasReseniadas = ref(null)
const peliculasMejorValoradas = ref(null)

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
async function cargarGraficos() {

  const { data } = await supabase
    .from('reseñas')
    .select(`
      rating,
      peliculas (
        titulo
      )
    `)

  if (!data) return

  const conteo = {}
  const ratings = {}

  data.forEach(r => {

    const titulo =
      r.peliculas?.titulo

    if (!titulo) return

    conteo[titulo] =
      (conteo[titulo] || 0) + 1

    if (!ratings[titulo]) {
      ratings[titulo] = []
    }

    ratings[titulo].push(r.rating)

  })

  const topResenias =
    Object.entries(conteo)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

  peliculasMasReseniadas.value = {

    labels:
      topResenias.map(
        p => p[0]
      ),

    datasets: [
      {
        label:
          'Cantidad de reseñas',

        data:
          topResenias.map(
            p => p[1]
          ),

        backgroundColor:
          '#1976D2'
      }
    ]

  }

  const promedios =
    Object.entries(ratings)
      .map(([titulo, notas]) => ({
        titulo,
        promedio:
          notas.reduce(
            (a, b) => a + b,
            0
          ) / notas.length
      }))
      .sort(
        (a, b) =>
          b.promedio - a.promedio
      )
      .slice(0, 5)

  peliculasMejorValoradas.value = {

    labels:
      promedios.map(
        p => p.titulo
      ),

    datasets: [
      {
        label:
          'Promedio',

        data:
          promedios.map(
            p =>
              p.promedio.toFixed(2)
          ),

        backgroundColor:
          '#FFC107'
      }
    ]

  }

}
onMounted(() => {

  cargarIndicadores()

  cargarGraficos()

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
<v-row class="mt-8">

  <v-col cols="12">

    <v-card
      elevation="6"
      class="pa-4"
    >

      <h3 class="mb-4">
        🎬 Películas más reseñadas
      </h3>

      <Bar
        v-if="peliculasMasReseniadas"
        :data="peliculasMasReseniadas"
      />

    </v-card>

  </v-col>

  <v-col
    cols="12"
    class="mt-4"
  >

    <v-card
      elevation="6"
      class="pa-4"
    >

      <h3 class="mb-4">
        ⭐ Mejor valoradas
      </h3>

      <Bar
        v-if="peliculasMejorValoradas"
        :data="peliculasMejorValoradas"
      />

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