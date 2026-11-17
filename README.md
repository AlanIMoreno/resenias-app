# Reseñas de películas

Aplicación web para explorar películas, compartir reseñas y administrar usuarios. El proyecto está desarrollado con Vue 3 y Vite; utiliza Supabase para autenticación y persistencia de datos, y The Movie Database (TMDb) para consultar información cinematográfica.


## Tabla de contenidos

- [Descripción general](#descripción-general)
- [Objetivos](#objetivos)
- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración del entorno](#configuración-del-entorno)
- [Variables VITE](#variables-vite)
- [GitHub Secrets para despliegue](#github-secrets-para-despliegue)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Casos de uso](#casos-de-uso)
- [Despliegue](#despliegue)


## Descripción general

La aplicación permite que una persona cree una cuenta, busque películas y consulte sus detalles. Los usuarios autenticados pueden publicar una reseña con una puntuación de 1 a 5 y un comentario, y editar o eliminar sus propias reseñas. También pueden volver a consultar las películas que reseñaron.

La plataforma incluye vistas administrativas para consultar indicadores, gestionar roles y moderar reseñas. La autenticación y los datos de perfiles, películas y reseñas se gestionan mediante Supabase. Los resultados de películas, sus valoraciones externas y sus imágenes se obtienen de TMDb.

## Objetivos

- Ofrecer una interfaz para buscar películas y consultar información y reseñas.
- Permitir a los usuarios registrarse y administrar sus propias reseñas.
- Incorporar vistas de administración para gestionar roles, supervisar reseñas y consultar indicadores.
- Aplicar una arquitectura frontend modular con rutas, estado compartido e integración con servicios externos.
- Servir como proyecto académico para practicar desarrollo web y consumo de APIs.

## Tecnologías

| Tecnología | Uso |
| --- | --- |
| [Vue 3](https://vuejs.org/) | Interfaz de usuario con componentes y Composition API. |
| [Vite](https://vite.dev/) | Servidor de desarrollo y compilación para producción. |
| [Vuetify](https://vuetifyjs.com/) | Componentes y estilos de interfaz. |
| [Vue Router](https://router.vuejs.org/) | Navegación entre vistas y control de acceso a rutas. |
| [Pinia](https://pinia.vuejs.org/) | Estado compartido de autenticación, usuarios y otros datos. |
| [Supabase](https://supabase.com/) | Autenticación y acceso a la base de datos desde el cliente. |
| [TMDb API](https://developer.themoviedb.org/) | Búsqueda y consulta de películas. |
| [TypeScript](https://www.typescriptlang.org/) | Herramientas de verificación de tipos para el proyecto Vue. |
| Node.js y npm | Entorno de ejecución y gestión de dependencias. |

## Arquitectura

La aplicación es una SPA (Single-Page Application) ejecutada en el navegador. No incluye un servidor backend propio.

```text
Navegador
└── Vue 3 + Vuetify
    ├── Vue Router ── navegación y comprobación de sesión/rol
    ├── Pinia ─────── estado compartido
    ├── Supabase JS ─ autenticación y consultas de datos
    │   └── Supabase Auth + tablas profiles, peliculas y reseñas
    └── TMDb API ──── búsqueda y detalles de películas
```

- **Presentación:** vistas Vue para inicio, autenticación, películas, detalle, reseñas y administración.
- **Navegación y acceso:** Vue Router define las rutas; solo inicio, acceso y registro son públicos. Las demás requieren sesión y las administrativas requieren el rol `admin`.
- **Estado:** Pinia mantiene información de sesión, perfiles, películas y notificaciones.
- **Datos y autenticación:** el cliente de Supabase se comunica directamente con Supabase. La aplicación espera tablas como `profiles`, `peliculas` y `reseñas`.
- **Catálogo externo:** el composable de TMDb realiza búsquedas y consultas de detalles desde el navegador.

## Requisitos previos

- Node.js **22.18 o superior** dentro de la serie `22.x`, o **24.12 o superior**. El proyecto declara estos rangos en `package.json`.
- npm, incluido con Node.js.
- Un proyecto de Supabase con autenticación y las tablas, columnas y relaciones que consulta la aplicación.
- Credenciales válidas para los servicios Supabase y TMDb.



## Instalación

1. Clona el repositorio y entra en su directorio:

   ```bash
   git clone https://github.com/AlanIMoreno/resenias-app.git
   cd resenias-app
   ```

2. Instala las dependencias:

   ```bash
   npm ci
   ```

   Si no dispones de `package-lock.json`, puedes usar `npm install`.

3. Configura los servicios externos siguiendo [Configuración del entorno](#configuración-del-entorno).

4. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. Abre en el navegador la dirección local que indique Vite en la terminal.

### Comandos disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo con recarga en caliente. |
| `npm run type-check` | Comprueba los tipos de los componentes Vue. |
| `npm run build` | Ejecuta la comprobación de tipos y genera la compilación de producción. |
| `npm run build-only` | Genera la compilación de producción sin ejecutar antes la comprobación de tipos. |
| `npm run preview` | Sirve localmente la compilación para revisarla. Ejecuta primero `npm run build`. |

## Configuración del entorno


## Variables VITE

Las siguientes variables son la propuesta para parametrizar las integraciones existentes. **Aún no están conectadas al código actual**; deben leerse explícitamente desde `import.meta.env` en los módulos correspondientes antes de que surtan efecto.

| Variable | Descripción | Sensibilidad y uso |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | URL del proyecto Supabase, por ejemplo `https://<proyecto>.supabase.co`. La utiliza el cliente de Supabase para conectarse al proyecto. | Configuración pública; no equivale a una contraseña. |
| `VITE_SUPABASE_ANON_KEY` | Clave pública `anon`/publishable utilizada por el cliente de Supabase. | Es visible en el navegador. Nunca la sustituyas por `service_role`; protege los datos mediante RLS. |
| `VITE_TMDB_API_KEY` | Clave de TMDb usada por las solicitudes de búsqueda y detalle de películas. | Al usarse directamente desde el navegador, queda expuesta al público. Aplica límites y restricciones; para mantenerla confidencial se necesita un backend o proxy. |

Vite expone al frontend únicamente las variables con prefijo `VITE_`. No coloques contraseñas, tokens administrativos ni claves privadas bajo ese prefijo.

## GitHub Secrets para despliegue

Actualmente el repositorio **no contiene un workflow de GitHub Actions**, y por tanto no hay GitHub Secrets configurados o consumidos por el proceso de despliegue. Los secretos no son necesarios para compilar con la configuración que hoy está escrita en el código.

Si se incorpora un workflow para compilar y desplegar, se pueden configurar estos valores desde **GitHub → Settings → Secrets and variables → Actions → New repository secret**:

| Nombre sugerido | Valor | Observaciones |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | URL del proyecto Supabase. | Es configuración pública; también se puede almacenar como variable de Actions si se prefiere. |
| `VITE_SUPABASE_ANON_KEY` | Clave pública `anon`/publishable del proyecto. | El nombre `Secrets` protege el valor durante la configuración del workflow, pero no evita que Vite lo incluya en el bundle público. |
| `VITE_TMDB_API_KEY` | Clave de API de TMDb. | El bundle frontend la hace visible al usuario. Un secret de GitHub no la convierte en privada en producción. |

Para que GitHub Actions las use, el workflow debe asignarlas al entorno del paso que ejecuta la compilación, por ejemplo:

```yaml
- name: Compilar aplicación
  run: npm ci && npm run build
  env:
    VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
    VITE_TMDB_API_KEY: ${{ secrets.VITE_TMDB_API_KEY }}
```

Este fragmento es ilustrativo: **no hay un workflow que lo ejecute en el repositorio actual**, y añadir los Secrets no tendrá efecto hasta migrar el código para leer estas variables. No guardes nunca `service_role`, contraseñas de usuarios ni credenciales administrativas en variables `VITE_*` o en código cliente.

## Estructura del proyecto

```text
.
├── public/                 # Recursos estáticos servidos directamente
├── src/
│   ├── assets/             # Recursos importados por la aplicación
│   ├── components/         # Componentes reutilizables
│   ├── composables/        # Lógica reutilizable (autenticación y TMDb)
│   ├── lib/                # Cliente de Supabase
│   ├── plugins/            # Configuración de Vuetify
│   ├── router/             # Rutas y guardas de navegación
│   ├── stores/             # Estado global con Pinia
│   ├── views/              # Vistas de usuario y administración
│   │   └── Dashboard/      # Indicadores, gestión de roles y reseñas
│   ├── App.vue             # Componente raíz
│   └── main.js             # Inicialización de Vue, Pinia, Router y Vuetify
├── index.html              # Documento HTML de entrada
├── package.json            # Dependencias, scripts y versión de Node
├── package-lock.json       # Versiones bloqueadas de dependencias
└── vite.config.ts          # Configuración de Vite
```

## Casos de uso

### Usuario

1. Crear una cuenta con nombre, correo electrónico y contraseña.
2. Iniciar sesión y cerrar sesión.
3. Buscar películas en TMDb y consultar sus detalles después de iniciar sesión.
4. Consultar las reseñas publicadas y el promedio de puntuaciones de usuarios.
5. Publicar una reseña con una puntuación de 1 a 5 y un comentario.
6. Editar o eliminar sus propias reseñas.
7. Consultar en **Mis películas** las películas que ha reseñado.

### Administrador

1. Acceder a las vistas protegidas por el rol `admin`.
2. Consultar indicadores de usuarios, películas, reseñas y administradores.
3. Revisar la lista de usuarios y cambiar su rol entre `user` y `admin`.
4. Consultar y moderar reseñas, incluida su eliminación.

Las operaciones administrativas también deben estar restringidas mediante políticas RLS en Supabase. Ocultar o proteger una ruta en el frontend no basta para autorizar una operación sobre la base de datos.



## Despliegue

La aplicación genera archivos estáticos en `dist/`, que pueden publicarse en un hosting compatible con sitios frontend, como Netlify, Vercel o Cloudflare Pages.

1. Configura Supabase y TMDb, y verifica que el código utilice los valores correctos. Para configurar credenciales por entorno, primero implementa la lectura de las variables de la sección [Variables VITE](#variables-vite).
2. Ejecuta localmente `npm ci` y `npm run build`.
3. Configura el proveedor de hosting para instalar con `npm ci` y ejecutar `npm run build`.
4. Establece `dist` como directorio de publicación.
5. Si el proveedor requiere variables de compilación, define allí las variables `VITE_*` necesarias. Recuerda que aparecerán en el bundle del navegador.
6. Configura el hosting para redirigir las rutas de la SPA a `index.html`; de lo contrario, una recarga directa en rutas internas como `/peliculas` podría devolver un error 404.
7. En Supabase, agrega el dominio de producción a las URL permitidas de autenticación y revisa las políticas RLS.

No hay actualmente una configuración de despliegue automatizado con GitHub Actions en este repositorio. Para automatizarlo, crea un workflow que instale dependencias, compile el proyecto y publique `dist/` en el proveedor elegido.


### Servicios y recursos de terceros

- [The Movie Database (TMDb)](https://www.themoviedb.org/) — información y recursos de películas.
- [Supabase](https://supabase.com/) — autenticación y backend de datos.
- [Unsplash](https://unsplash.com/) — imágenes utilizadas como fondos, cuando corresponda.
