process.loadEnvFile('../.env') // es cargar las variables de entorno del .env

import { test } from 'node:test'
import assert from 'node:assert'
import os from 'node:os'

import { Stagehand, localBrowser } from '@browserbasehq/stagehand'

process.chdir(os.tmpdir())

test('Un usuario puede iniciar sesión y guardar los dos primeros empleos como favoritos', async () => {
  const browser = await localBrowser.launch({ headless: true })

  const stagehand = await Stagehand.create({
    model: {
      modelName: 'google/gemini-2.5-flash',
      apiKey: process.env.GEMINI_API_KEY
    },
    browser
  })

  try {
    const [page] = await stagehand.browser.context.pages()

    await page.goto('http://localhost:5173')

    await stagehand.act('Haz click en el botón "Iniciar sesión" de la cabecera')

    await stagehand.act('Haz click en el enlace "Empleos" de la cabecera')

    await stagehand.act('Haz click en el botón de corazón blanco "Agregar a favoritos" de la primera oferta de empleo de la lista de resultados')

    await stagehand.act('Haz click en el botón de corazón blanco "Agregar a favoritos" de la segunda oferta de empleo de la lista de resultados')

    const { data } = await stagehand.extract('Extrae solo el número que aparece en el contador "Favoritos" de la cabecera')
    console.log('Favoritos extraído:', data.extraction)

    assert.strictEqual(data.extraction, '2')
  } finally {
    await stagehand.close()
    await browser.close()
  }
})
