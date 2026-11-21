<script setup>
import { onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useSnackbarStore } from './stores/snackbar' // <-- 1. Importamos el store
import { supabase } from './lib/supabase'

const router = useRouter()
const route = useRoute()

const authStore = useAuthStore()
const snackbar = useSnackbarStore() // <-- 2. Inicializamos el store

const estaEnDashboard = computed(() => {
  return route.path.startsWith('/dashboard')
})

onMounted(async () => {
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) {
    return
  }

  authStore.setSession(session)

  const { data: profile } =
    await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

  authStore.setProfile(profile)

})

async function logout() {
  await supabase.auth.signOut()
  authStore.clear()
  router.push('/login')
}
</script>

<template>
  <v-app>
    <v-app-bar
      color="indigo-darken-2"
      density="comfortable"
      elevation="4"
    >
      <v-app-bar-title>
        🎬 Reseñas App
      </v-app-bar-title>

      <template
        v-if="
          authStore.user &&
          !estaEnDashboard
        "
      >
        <v-btn
          to="/"
          variant="text"
        >
          Inicio
        </v-btn>

        <v-btn
          to="/peliculas"
          variant="text"
        >
          Películas
        </v-btn>

        <v-btn
          to="/mis-peliculas"
          variant="text"
        >
          Mis películas
        </v-btn>
<v-btn
  v-if="authStore.user"
  to="/recomendaciones"
  variant="text"
>
  IA Recomendaciones
</v-btn>
        <v-btn
          v-if="
            authStore.role === 'admin'
          "
          to="/dashboard/indicators"
          variant="text"
        >
          Dashboard
        </v-btn>
      </template>

      <v-spacer />

      <v-chip
        v-if="authStore.user"
        class="mr-3"
        color="white"
      >
        {{ authStore.user.email }}
      </v-chip>

      <v-btn
        v-if="authStore.user"
        color="red"
        @click="logout"
      >
        Salir
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <!-- 3. Agregamos el Snackbar global -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      location="bottom right"
    >
      {{ snackbar.text }}

      <template #actions>
        <v-btn variant="text" @click="snackbar.show = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<style scoped>
h1 {
  color: #42b983;
  font-family: Arial, sans-serif;
}
</style>