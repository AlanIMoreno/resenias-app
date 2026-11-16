<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useAuthStore } from '../stores/auth'
import { useSnackbarStore } from '../stores/snackbar'
import { supabase } from '../lib/supabase'

const router = useRouter()
const authStore = useAuthStore()
const snackbar = useSnackbarStore()
const { signup } = useAuth()

const email = ref('')
const password = ref('')

async function registrar() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email.value.trim() || !password.value.trim()) {
    snackbar.mostrar('Complete correo electrónico y contraseña', 'warning')
    return
  }

  if (!emailRegex.test(email.value)) {
    snackbar.mostrar('Ingrese un correo electrónico válido', 'error')
    return
  }

  const { data, error } = await signup(
    email.value,
    password.value
  )

  if (error) {
    snackbar.mostrar(error.message, 'error')
    return
  }

  if (data?.session) {
    authStore.setSession(data.session)

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profile) {
      authStore.setProfile(profile)
    }
  }

  snackbar.mostrar('Usuario registrado correctamente', 'success')
  
  router.push('/')
}
</script>

<template>
  <v-container
    fluid
    class="register-container"
  >
    <v-row
      justify="center"
      align="center"
      class="fill-height"
    >
      <v-col
        cols="12"
        sm="8"
        md="6"
        lg="4"
      >
        <v-card
          elevation="10"
          class="pa-8"
        >
          <div class="text-center mb-6">
            <h1 class="text-h4 mb-2">
              📝 Crear cuenta
            </h1>

            <p class="text-medium-emphasis">
              Regístrate para comenzar a crear y gestionar tus reseñas.
            </p>
          </div>

          <v-text-field
            v-model="email"
            label="Correo electrónico"
            type="email"
            prepend-inner-icon="mdi-email"
            variant="outlined"
          />

          <v-text-field
            v-model="password"
            label="Contraseña"
            type="password"
            prepend-inner-icon="mdi-lock"
            variant="outlined"
            @keyup.enter="registrar"
          />

          <v-btn
            block
            color="success"
            size="large"
            class="mt-2"
            @click="registrar"
          >
            Registrarse
          </v-btn>

          <div class="text-center mt-6">
            <span>
              ¿Ya tienes cuenta?
            </span>

            <br>

            <v-btn
              variant="text"
              color="primary"
              to="/login"
            >
              Iniciar sesión
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.register-container {
  min-height: 85vh;
}
</style>