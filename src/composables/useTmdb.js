const API_KEY =
  import.meta.env.VITE_TMDB_API_KEY

export function useTmdb() {

  async function buscarPeliculas(query) {

    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`
    )

    const data = await response.json()

    return data.results || []
  }

  async function obtenerPelicula(id) {

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
    )

    return await response.json()
  }

  async function obtenerRecomendaciones(id) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${API_KEY}`,
        { signal: controller.signal }
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.status_message || `TMDb respondió con HTTP ${response.status}`)
      }

      return data.results || []
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('La solicitud de recomendaciones a TMDb excedió el tiempo de espera.')
      }
      throw error
    } finally {
      clearTimeout(timeoutId)
    }
  }

  return {
    buscarPeliculas,
    obtenerPelicula,
    obtenerRecomendaciones
  }
}