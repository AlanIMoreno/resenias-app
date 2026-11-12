
<template>
  <div>
<v-toolbar
  v-if="authStore.role === 'admin'"
  density="compact"
  color="primary"
>      <v-toolbar-title class="pl-2">
        Dashboard
      </v-toolbar-title>

      <v-spacer />

      <v-tabs
        v-model="tabs"
        color="white"
        slider-color="white"
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
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

const tabs = ref(null)

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
