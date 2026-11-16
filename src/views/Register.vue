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

  alert('Usuario registrado correctamente')

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