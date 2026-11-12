<script setup lang="js">
import { useUsuariosStore } from '../stores/usuarios'

const usuariosStore = useUsuariosStore()
usuariosStore.cargarUsuarios()

// variable local para el input
import { ref } from 'vue'
const nuevo = ref('')
</script>

<template>
  <div>
    <h2>Usuarios</h2>

    <ul>
      <li v-for="u in usuariosStore.lista" :key="u.id">
        {{ u.nombre }}
        <button @click="usuariosStore.eliminarUsuario(u.id)">Eliminar</button>
      </li>
    </ul>

    <input v-model="nuevo" placeholder="Nombre nuevo" />
    <button @click="usuariosStore.agregarUsuario({ id: Date.now(), nombre: nuevo })">
      Agregar
    </button>
  </div>
</template>
