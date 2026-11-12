import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../lib/supabase'
const routes = [

  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue')
  },

  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/Dashboard/Layout.vue'),
    meta: {
      role: 'admin'
    },
    children: [
      {
        path: 'indicators',
        name: 'dashboard.indicators',
        component: () =>
          import('../views/Dashboard/Indicators.vue'),
        meta: {
          role: 'admin'
        }
      },
      {
        path: 'backup',
        name: 'dashboard.backup',
        component: () =>
          import('../views/Dashboard/Backup.vue'),
        meta: {
          role: 'admin'
        }
      },
      {
        path: 'logs',
        name: 'dashboard.logs',
        component: () =>
          import('../views/Dashboard/Logs.vue'),
        meta: {
          role: 'admin'
        }
      },{
  path: '/mis-peliculas',
  name: 'mis-peliculas',
  component: () =>
    import('../views/MisPeliculas.vue')
}
    ]
  },

  {
    path: '/admin',
    component: () =>
      import('../views/Admin.vue'),
    meta: {
      role: 'admin'
    }
  },

  {
    path: '/peliculas',
    name: 'peliculas',
    component: () =>
      import('../views/Peliculas.vue')
  },

  {
    path: '/peliculas/:id',
    name: 'pelicula-detalle',
    component: () =>
      import('../views/PeliculaDetalle.vue')
  },

  {
    path: '/login',
    component: () =>
      import('../views/Login.vue')
  },

  {
    path: '/register',
    component: () =>
      import('../views/Register.vue')
  }

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
router.beforeEach(async (to, from, next) => {

  const authStore = useAuthStore()
console.log('RUTA', to.path)
console.log('ROLE', authStore.role)
console.log('META ROLE', to.meta.role)
  const {
    data: { session }
  } = await supabase.auth.getSession()

  const rutasPublicas = [
    '/',
    '/login',
    '/register'
  ]

  const esPublica =
    rutasPublicas.includes(to.path)
if (
  session &&
  (
    to.path === '/login' ||
    to.path === '/register'
  )
) {

  next('/peliculas')
  return

}
  if (!session && !esPublica) {

    next('/login')
    return

  }

 const requiredRole =
  to.matched.find(
    route => route.meta.role
  )?.meta.role

if (requiredRole) {

  const { data: profile } =
    await supabase
      .from('profiles')
      .select('rol')
      .eq('id', session.user.id)
      .single()

  if (!profile) {

    next('/peliculas')
    return

  }

  if (profile.rol !== requiredRole){

    next('/peliculas')
    return

  }

}
console.log('ACCESO PERMITIDO')
console.log('RUTA DESTINO', to.path)
  next()

})
export default router
