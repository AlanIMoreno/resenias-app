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

const nombre = ref('')
const email = ref('')
const password = ref('')

async function registrar() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!nombre.value.trim() || !email.value.trim() || !password.value.trim()) {
    snackbar.mostrar('Complete nombre de usuario, correo y contraseña', 'warning')
    return
  }

  if (nombre.value.trim().length < 3) {
    snackbar.mostrar('El nombre de usuario debe tener al menos 3 caracteres', 'warning')
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

  if (data?.session && data?.user) {
    authStore.setSession(data.session)

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .update({ nombre: nombre.value.trim() })
      .eq('id', data.user.id)
      .select()
      .single()

    if (profileError) {
      snackbar.mostrar('Cuenta creada, pero no se pudo guardar el nombre: ' + profileError.message, 'warning')
    } else if (profile) {
      authStore.setProfile(profile)
    }
  }

  snackbar.mostrar('Usuario registrado correctamente', 'success')
  router.push('/')
}
</script>

<template>
  <div class="register-wrapper">
    <v-container
      fluid
      class="register-container fill-height"
    >
      <v-row
        justify="center"
        align="center"
      >
        <v-col
          cols="12"
          sm="8"
          md="6"
          lg="4"
        >
          <v-card
            elevation="16"
            class="pa-8 register-card"
          >
            <div class="text-center mb-6">
              <h1 class="text-h4 mb-2 font-weight-bold">
                📝 Crear cuenta
              </h1>

              <p class="text-medium-emphasis">
                Regístrate para comenzar a crear y gestionar tus reseñas.
              </p>
            </div>

            <v-text-field
              v-model="nombre"
              label="Nombre de usuario"
              type="text"
              variant="outlined"
              class="mb-2"
            />

            <v-text-field
              v-model="email"
              label="Correo electrónico"
              type="email"
              variant="outlined"
              class="mb-2"
            />

            <v-text-field
              v-model="password"
              label="Contraseña"
              type="password"
              variant="outlined"
              @keyup.enter="registrar"
            />

            <v-btn
              block
              color="primary"
              size="large"
              class="mt-2 font-weight-bold"
              @click="registrar"
            >
              Registrarse
            </v-btn>

            <div class="text-center mt-6">
              <span class="text-medium-emphasis">
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
  </div>
</template>

<style scoped>
.register-wrapper {
  min-height: 90vh;
  background-image: 
    linear-gradient(rgba(11, 14, 20, 0.82), rgba(11, 14, 20, 0.94)),
    url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.register-container {
  min-height: 90vh;
}

.register-card {
  background: rgba(20, 25, 35, 0.85) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #F8FAFC !important;
}
</style>