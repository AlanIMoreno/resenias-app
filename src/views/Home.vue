<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const estaLogueado = computed(() => {
  return !!authStore.user
})

function irLogin() {
  router.push('/login')
}

function irRegistro() {
  router.push('/register')
}

function irPeliculas() {
  router.push('/peliculas')
}

function irMisPeliculas() {
  router.push('/mis-peliculas')
}
</script>

<template>
  <div class="hero">
    <video
      autoplay
      muted
      loop
      playsinline
      class="video-fondo"
    >
      <source
        src="/videos/vid.mp4"
        type="video/mp4"
      >
    </video>

    <div class="overlay">
      <v-container fluid>
        <v-row
          justify="center"
          align="center"
          class="fill-height"
        >
          <v-col
            cols="12"
            md="8"
            lg="6"
          >
            <div class="text-center">
              <h1 class="titulo">
                🎬 Reseñas de Películas
              </h1>

              <p class="subtitulo">
                Descubre películas, comparte opiniones
                y consulta valoraciones de otros usuarios.
              </p>

              <div
                v-if="!estaLogueado"
                class="botones"
              >
                <v-btn
                  color="primary"
                  size="large"
                  @click="irLogin"
                >
                  Iniciar sesión
                </v-btn>

                <v-btn
                  color="success"
                  size="large"
                  @click="irRegistro"
                >
                  Registrarse
                </v-btn>
              </div>

              <div
                v-else
                class="botones"
              >
                <v-btn
                  color="primary"
                  size="large"
                  @click="irPeliculas"
                >
                  Explorar películas
                </v-btn>

                <v-btn
                  color="secondary"
                  size="large"
                  @click="irMisPeliculas"
                >
                  Mis películas
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>

        <v-row style="margin-top: 140px;">
          <v-col
            cols="12"
            md="4"
          >
            <v-card
              elevation="6"
              class="pa-4 text-center"
            >
              <div class="text-h3">
                🎬
              </div>

              <div class="text-h5 mt-2">
                Películas
              </div>

              <div class="text-medium-emphasis">
                Busca y descubre películas.
              </div>
            </v-card>
          </v-col>

          <v-col
            cols="12"
            md="4"
          >
            <v-card
              elevation="6"
              class="pa-4 text-center"
            >
              <div class="text-h3">
                ⭐
              </div>

              <div class="text-h5 mt-2">
                Reseñas
              </div>

              <div class="text-medium-emphasis">
                Comparte tu opinión con otros usuarios.
              </div>
            </v-card>
          </v-col>

          <v-col
            cols="12"
            md="4"
          >
            <v-card
              elevation="6"
              class="pa-4 text-center"
            >
              <div class="text-h3">
                👥
              </div>

              <div class="text-h5 mt-2">
                Comunidad
              </div>

              <div class="text-medium-emphasis">
                Consulta valoraciones reales.
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.video-fondo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  background: rgba(0, 0, 0, 0.55);
  color: white;
  display: flex;
  align-items: center;
}

.titulo {
  font-size: 3.5rem;
  margin-bottom: 20px;
  font-weight: bold;
}

.subtitulo {
  font-size: 1.3rem;
  margin-bottom: 30px;
}

.botones {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.v-card {
  background: rgba(20, 25, 35, 0.85) !important;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #F8FAFC !important;
}
</style>