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
          elevation="10"
          class="pa-8"
        >

          <div class="text-center mb-6">

            <h1 class="text-h4 mb-2">
              🔐 Iniciar sesión
            </h1>

            <p class="text-medium-emphasis">
              Accede para gestionar tus reseñas de películas.
            </p>

          </div>

          <v-text-field
            v-model="email"
            label="Correo electrónico"
            prepend-inner-icon="mdi-email"
            variant="outlined"
          />

          <v-text-field
            v-model="password"
            label="Contraseña"
            type="password"
            prepend-inner-icon="mdi-lock"
            variant="outlined"
          />

          <v-btn
            block
            color="primary"
            size="large"
            class="mt-2"
            @click="ingresar"
          >
            Ingresar
          </v-btn>

          <div class="text-center mt-6">

            <span>
              ¿No tienes cuenta?
            </span>

            <br>

            <v-btn
              variant="text"
              color="success"
              to="/register"
            >
              Registrarse
            </v-btn>

          </div>

        </v-card>

      </v-col>

    </v-row>

  </v-container>

</template>

<style scoped>

.login-container {
  min-height: 85vh;
}

</style>