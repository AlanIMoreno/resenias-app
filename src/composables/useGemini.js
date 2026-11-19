const API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY

export function useGemini() {

  async function analizarGustos(peliculas) {

    const prompt = `
Analiza los gustos cinematográficos del usuario.

Películas mejor valoradas:

${peliculas.join('\n')}

Responde en español.

Indica:

1. Qué géneros parecen gustarle.
2. Qué características tienen esas películas.
3. Recomienda exactamente 3 películas.
`

const controller = new AbortController()
const timeoutId = setTimeout(() => controller.abort(), 15000)

try {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      }),
      signal: controller.signal
    }
  )

  const data = await response.json()

  if (!response.ok || data.error) {
    throw new Error(data.error?.message || `Gemini respondió con HTTP ${response.status}`)
  }

  const respuesta = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!respuesta?.trim()) {
    throw new Error('Gemini devolvió una respuesta vacía.')
  }

  return respuesta
} catch (error) {
  if (error.name === 'AbortError') {
    throw new Error('La solicitud a Gemini excedió el tiempo de espera.')
  }
  throw error
} finally {
  clearTimeout(timeoutId)
}
  }

  return {
    analizarGustos
  }
}