# Reseñas de películas

Aplicación web de una sola página para buscar películas, consultar y publicar reseñas, administrar usuarios y obtener recomendaciones personalizadas. La interfaz está hecha con Vue 3 y Vuetify; Supabase gestiona autenticación y datos, y TMDb aporta información sobre películas.

## Funcionalidades

- Registro, inicio y cierre de sesión.
- Búsqueda de películas y consulta de sus detalles mediante TMDb.
- Creación, consulta, edición y eliminación de reseñas con puntuaciones de 1 a 5.
- Página **Mis películas**, con acceso a las películas reseñadas por la persona autenticada.
- Panel de administración protegido por rol, con indicadores, gestión de roles y moderación de reseñas.
- Recomendaciones con análisis de preferencias mediante Gemini y alternativa de recomendaciones de TMDb.
- Aplicación instalable como PWA.

## Tecnologías y arquitectura

| Tecnología | Responsabilidad |
| --- | --- |
| Vue 3 | Interfaz basada en componentes y Composition API. |
| Vue Router | Navegación SPA y protección de rutas. |
| Pinia | Estado compartido de autenticación y notificaciones, además de stores de dominio. |
| Vuetify | Componentes visuales. |
| Supabase | Autenticación y acceso a perfiles, películas y reseñas. |
| TMDb | Búsqueda, detalles y recomendaciones de películas. |
| Gemini | Análisis de gustos cinematográficos. |
| Vite + `vite-plugin-pwa` | Desarrollo, compilación y recursos PWA. |

```text
src/
├── components/       # Componentes Vue; incluye un componente de ejemplo sin uso actual
├── composables/      # Integraciones con Supabase Auth, TMDb y Gemini
├── lib/              # Cliente Supabase
├── plugins/          # Configuración de Vuetify
├── router/           # Rutas y guarda de acceso
├── stores/           # Estado Pinia
├── views/            # Pantallas de usuario y administración
│   └── Dashboard/    # Indicadores, usuarios y moderación de reseñas
├── App.vue           # Estructura principal y navegación
└── main.js           # Inicialización de Vue, Pinia, Router y PWA
```

## Rutas principales

| Ruta | Acceso y función |
| --- | --- |
| `/` | Inicio, acceso público. |
| `/login`, `/register` | Autenticación y alta de cuenta. |
| `/peliculas`, `/peliculas/:id` | Búsqueda, detalle y reseñas. Requieren sesión. |
| `/mis-peliculas` | Películas reseñadas por la persona autenticada. Requiere sesión. |
| `/recomendaciones` | Análisis con IA y recomendaciones. Requiere sesión. |
| `/dashboard/indicators` | Indicadores administrativos. Requiere rol `admin`. |
| `/dashboard/backup` | Listado de usuarios y modificación de roles. Requiere rol `admin`. |
| `/dashboard/logs` | Moderación de reseñas. Requiere rol `admin`. |

La guarda de `src/router/index.js` consulta la sesión de Supabase y el rol del perfil para autorizar rutas administrativas. La autorización del lado del cliente no reemplaza las políticas de seguridad de la base de datos.

## Requisitos

- Node.js `^22.18.0` o `>=24.12.0` y npm.
- Un proyecto Supabase con autenticación habilitada.
- Credenciales para Supabase y TMDb. Para recomendaciones con IA también se necesita una clave de Gemini.

La aplicación espera las tablas `profiles`, `peliculas` y `reseñas`, así como los campos y relaciones que consultan las vistas. El repositorio no incluye migraciones SQL ni políticas RLS; deben prepararse en Supabase antes de probar las operaciones. En particular, configura las políticas para que cada usuario gestione sus propias reseñas y para restringir las operaciones administrativas.

## Instalación y ejecución

```bash
git clone https://github.com/AlanIMoreno/resenias-app.git
cd resenias-app
npm ci
```

Crea un archivo `.env` en la raíz y configura:

```dotenv
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-publica
VITE_TMDB_API_KEY=tu-clave-de-tmdb
VITE_GEMINI_API_KEY=tu-clave-de-gemini
```

El `.env` está excluido del repositorio mediante `.gitignore`. Las variables con prefijo `VITE_` se incorporan al código cliente y pueden ser visibles en el navegador; nunca uses aquí una clave `service_role`, una contraseña ni credenciales administrativas. Protege el acceso a Supabase con RLS y aplica restricciones y cuotas a las claves de servicios externos.

Luego ejecuta:

```bash
npm run dev
```

Abre la dirección local indicada por Vite.

## Comandos

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo. |
| `npm run type-check` | Verificación de tipos de los componentes Vue. |
| `npm run build` | Verificación de tipos y compilación de producción. |
| `npm run build-only` | Compilación sin la verificación previa de tipos. |
| `npm run preview` | Vista local de la compilación. |

## PWA

`vite.config.ts` define el manifiesto y los íconos de la aplicación. `src/main.js` registra el service worker con actualización automática. La PWA permite instalar la interfaz; las operaciones que dependen de Supabase, TMDb o Gemini siguen requiriendo conexión y sus servicios configurados.

## Integración y despliegue

Hay dos workflows que se ejecutan ante cambios en `main`:

- `.github/workflows/ci.yml` instala dependencias y ejecuta `npm run build`.
- `.github/workflows/deploy.yml` solicita a Netlify iniciar el despliegue mediante un build hook. No publica directamente `dist` desde GitHub Actions.

Configura en GitHub Actions el secret `NETLIFY_BUILD_HOOK` con la URL privada del build hook de Netlify. Configura las cuatro variables `VITE_*` en el entorno de compilación del proveedor que construya la aplicación (por ejemplo, Netlify); el workflow de despliegue solo dispara el hook. Para despliegues manuales, ejecuta `npm run build` y publica el contenido de `dist/`. El hosting debe redirigir las rutas de la SPA a `index.html`.

El pipeline actual no ejecuta pruebas unitarias: el proyecto no declara un comando de pruebas en `package.json`.
