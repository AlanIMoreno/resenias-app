
<template>
  <div>
<v-toolbar
  v-if="authStore.role === 'admin'"
  density="comfortable"
  color="indigo-darken-2"
  elevation="6"
>

<v-toolbar-title class="pl-2 text-h6">

  🛡️ Panel de Administración

</v-toolbar-title>

      <v-spacer />
<v-tabs
  v-model="tabs"
  color="white"
  slider-color="amber"
  align-tabs="center"
>
        <v-tab
          v-for="tabsItem in tabsItems"
          :key="tabsItem.id"
          :to="tabsItem.link"
        >
          <span class="pl-2 pr-2">
            {{ tabsItem.title }}
          </span>
        </v-tab>
      </v-tabs>
<v-chip
  class="mr-2"
  color="white"
  size="small"
>

  {{ authStore.user?.email }}

</v-chip>
      <v-btn
        icon
        variant="text"
        color="white"
        aria-label="Cerrar sesión"
        title="Cerrar sesión"
        @click="cerrarSesion"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 17v-3H3v-4h7V7l5 5-5 5Zm-5 4a2 2 0 0 1-2-2v-3h2v3h14V5H5v3H3V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5Z" />
        </svg>
      </v-btn>
    </v-toolbar>

    <v-container>
      <v-row>
        <v-col cols="12" md="8" offset-md="2">
          <router-view v-slot="{ Component }">
            <v-slide-y-transition mode="out-in">
              <component :is="Component" />
            </v-slide-y-transition>
          </router-view>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { supabase } from '../../lib/supabase'

const authStore = useAuthStore()
const router = useRouter()

const tabs = ref(null)

async function cerrarSesion() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    alert(error.message)
    return
  }

  authStore.clear()
  await router.replace('/login')
}

const tabsItems = [
  {
    id: 1,
    title: '🏠 Inicio',
    link: '/'
  },
  {
    id: 2,
    title: '🎬 Películas',
    link: '/peliculas'
  },
  {
    id: 3,
    title: '📊 Indicators',
    link: '/dashboard/indicators'
  },
  {
    id: 4,
    title: '👥 Usuarios',
    link: '/dashboard/backup'
  },
  {
    id: 5,
    title: '📝 Reseñas',
    link: '/dashboard/logs'
  }
]
</script>
<style scoped>

.v-toolbar {
  border-radius: 0 0 12px 12px;
}

</style>