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
    router.push('/')
  }
}
</script>

<template>
  <div class="login-wrapper">
    <v-container
      fluid
      class="login-container"
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
            elevation="16"
            class="pa-8 login-card"
          >
            <div class="text-center mb-6">
              <h1 class="text-h4 mb-2 font-weight-bold">
                🔐 Iniciar sesión
              </h1>

              <p class="text-medium-emphasis">
                Accede para gestionar tus reseñas de películas.
              </p>
            </div>

            <v-text-field
              v-model="email"
              label="Correo electrónico"
              variant="outlined"
              class="mb-2"
            />

            <v-text-field
              v-model="password"
              label="Contraseña"
              type="password"
              variant="outlined"
              @keyup.enter="ingresar"
            />

            <v-btn
              block
              color="primary"
              size="large"
              class="mt-2 font-weight-bold"
              @click="ingresar"
            >
              Ingresar
            </v-btn>

            <div class="text-center mt-6">
              <span class="text-medium-emphasis">
                ¿No tienes cuenta?
              </span>

              <br>

              <v-btn
                variant="text"
                color="primary"
                to="/register"
              >
                Registrarse
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.login-wrapper {
  min-height: 90vh;
  background-image: 
    linear-gradient(rgba(11, 14, 20, 0.82), rgba(11, 14, 20, 0.94)),
    url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.login-container {
  min-height: 90vh;
}

.login-card {
  background: rgba(20, 25, 35, 0.85) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #F8FAFC !important;
}
</style>