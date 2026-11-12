<script setup>

import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

const { signup } = useAuth()

const email = ref('')
const password = ref('')

async function registrar() {

  const { error } =
    await signup(
      email.value,
      password.value
    )

  if (error) {

    alert(error.message)

    return

  }

  alert('Usuario registrado')

}

</script>

<template>

  <v-container>

    <h1>Registro</h1>

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
      color="success"
      @click="registrar"
    >
      Registrarse
    </v-btn>

  </v-container>

</template>