<script setup>

import { ref } from 'vue'

import { useRouter } from 'vue-router'

import { useAuth } from '../composables/useAuth'

import { useAuthStore } from '../stores/auth'
import { supabase } from '../lib/supabase'
const router = useRouter()

const authStore = useAuthStore()

const { login } = useAuth()

const email = ref('')

const password = ref('')

async function ingresar() {

  const {
    data,
    error
  } = await login(
    email.value,
    password.value
  )

  if (error) {

    alert(error.message)

    return

  }

authStore.setSession(
  data.session
)

const { data: profile } =
  await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single()

authStore.setProfile(profile)

if (profile?.rol === 'admin') {

  router.push('/dashboard/indicators')

} else {

  router.push('/peliculas')


}}

</script>

<template>

  <v-container>

    <h1>Login</h1>

    <v-text-field
      v-model="email"
      label="Email"
    />

    <v-text-field
      v-model="password"
      label="Password"
      type="password"
    />

    <v-btn
      color="primary"
      @click="ingresar"
    >
      Ingresar
    </v-btn>

  </v-container>

</template>