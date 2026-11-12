const API_KEY = '33a1491efdbe8c92b8ba084e240b576f'

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

  return {
    buscarPeliculas,
    obtenerPelicula
  }
}