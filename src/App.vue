<script setup>
import { onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { supabase } from './lib/supabase'

const router = useRouter()
const route = useRoute()

const authStore = useAuthStore()

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
console.log('PROFILE APP', profile)
console.log('ROLE STORE', authStore.role)
})

async function logout() {

  await supabase.auth.signOut()

  authStore.clear()

  router.push('/login')

}
</script>

<template>
  <div>

  <div
  style="
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:20px;
  "
>

  <h1>
    Reseñas App
  </h1>

  <div
    style="
      display:flex;
      gap:10px;
    "
  ><div
  v-if="!estaEnDashboard"
  style="
    display:flex;
    gap:10px;
  "
>

  <v-btn
    v-if="authStore.role === 'admin'"
    color="primary"
    to="/dashboard/indicators"
  >
    Dashboard
  </v-btn>

  <v-btn
    v-if="authStore.user"
    color="primary"
    to="/peliculas"
  >
    Películas
  </v-btn>
  <v-btn
    v-if="authStore.user"
    color="secondary"
    to="/mis-peliculas"
  >
    Mis películas
  </v-btn>

 
  <v-btn
    v-if="authStore.user"
    color="error"
    @click="logout"
  >
    Cerrar sesión
  </v-btn>

</div>
  </div>

</div>

    <router-view />

  </div>
</template>

<style scoped>
h1 {
  color: #42b983;
  font-family: Arial, sans-serif;
}
</style>