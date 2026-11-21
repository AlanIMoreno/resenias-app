const API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY

export function useGemini() {

  async function analizarGustos(peliculas) {

const prompt = `
Analiza los gustos cinematográficos del usuario.

Películas mejor valoradas:

${peliculas.join('\n')}

Responde únicamente en español.

Máximo 120 palabras.

Formato obligatorio:

🎭 Géneros favoritos:
- género 1
- género 2
- género 3

🎬 Recomendaciones:
- película 1
- película 2
- película 3
Inicia con una breve introduccion de no mas de 4 lineas analizando los gustos del usuario. 
No expliques cada película.
No agregues introducciones largas.
Sé breve y directo.
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