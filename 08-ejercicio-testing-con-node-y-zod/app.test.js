/*
 * Aquí debes escribir tus tests para la API de jobs
 *
 * Recuerda:
 * - Usar node:test y node:assert (sin dependencias externas)
 * - Levantar el servidor con before() y cerrarlo con after()
 * - Testear todos los endpoints: GET, POST, PUT, PATCH, DELETE
 * - Verificar validaciones con Zod
 * - Comprobar códigos de estado HTTP correctos
 */
import { describe, test, before, after } from 'node:test'
import assert, { rejects } from 'node:assert'
import app from './app.js'
import mockJobs from './jobs.json' with { type: 'json' }

const testJob2 = mockJobs[1] // d35b2c89-5d60-4f26-b19a-6cfb2f1a0f57, Analista de Datos
const testJob3 = mockJobs[2] // para el test de PUT
const testJob4 = mockJobs[3] // f62d8a34-923a-4ac2-9b0b-14e0ac2f5405, para el test de PATCH
const testJobDelete = mockJobs[mockJobs.length - 1] // para el test de DELETE

let server
const PORT = 6789
const BASE_URL = `http://localhost:${PORT}`

before(async () => {
  return new Promise((resolve, reject) => {
    server = app.listen(PORT, () => resolve())
    server.on('error', reject)
  })
})

after(async () => {
  return new Promise((resolve) => {
    server.close((err) => {
      if (err) return rejects(err)
      resolve()
    })
  })
})

describe('GET /jobs', () => {
  test('debe responder con 200 y un array de trabajos', async () => {
    const response = await fetch(`${BASE_URL}/jobs`)
    assert.strictEqual(response.status, 200)

    const body = await response.json()
    assert.ok(Array.isArray(body.data), 'json.data debe ser un array')
  })

  test('debe filtrar trabajos por tecnología', async () => {
    const response = await fetch(`${BASE_URL}/jobs?technology=react`)
    assert.strictEqual(response.status, 200)

    const body = await response.json()
    assert.ok(body.data.length > 0, 'Debe encontrar trabajos con tecnología react')
    body.data.forEach(job => {
      assert.ok(job.data.technology.includes('react'), 'Todos los trabajos devueltos deben incluir la tecnología react')
    })
  })

  test('debe respetar el límite de resultados', async () => {
    const response = await fetch(`${BASE_URL}/jobs?limit=2`)
    assert.strictEqual(response.status, 200)

    const body = await response.json()
    assert.strictEqual(body.limit, 2)
    assert.strictEqual(body.data.length, 2)
  })

  test('debe aplicar offset correctamente', async () => {
    const response = await fetch(`${BASE_URL}/jobs?offset=1`)
    assert.strictEqual(response.status, 200)

    const body = await response.json()
    assert.strictEqual(body.data[0].id, testJob2.id, 'El primer resultado debe ser el segundo trabajo del JSON')
  })
})

describe('POST /jobs', () => {
  test('el nuevo trabajo se añade correctamente con buen formato', async () => {
    const jobData = {
      titulo: 'Frontend Developer',
      empresa: 'Nueva Empresa',
      ubicacion: 'Remoto',
      descripcion: 'Buscamos desarrollador frontend con experiencia en React',
      data: {
        technology: ['react', 'javascript'],
        modalidad: 'remoto',
        nivel: 'mid-level'
      }
    }

    const response = await fetch(`${BASE_URL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)
    })
    assert.strictEqual(response.status, 201)

    const body = await response.json()
    assert.ok(body.id, 'El trabajo devuelto debe tener un id generado')
    assert.strictEqual(body.titulo, jobData.titulo)
    assert.strictEqual(body.empresa, jobData.empresa)
    assert.strictEqual(body.ubicacion, jobData.ubicacion)
    assert.strictEqual(body.descripcion, jobData.descripcion)
    assert.deepStrictEqual(body.data, jobData.data)
  })

  describe('la petición es validada correctamente', () => {
    test('debe devolver 400 con titulo de menos de 3 caracteres', async () => {
      const response = await fetch(`${BASE_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: 'ab', empresa: 'Empresa Test', ubicacion: 'Remoto' })
      })
      assert.strictEqual(response.status, 400)
    })

    test('debe devolver 400 con titulo de más de 100 caracteres', async () => {
      const response = await fetch(`${BASE_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: 'a'.repeat(101), empresa: 'Empresa Test', ubicacion: 'Remoto' })
      })
      assert.strictEqual(response.status, 400)
    })

    test('debe devolver 400 sin campo titulo', async () => {
      const response = await fetch(`${BASE_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empresa: 'Empresa Test', ubicacion: 'Remoto' })
      })
      assert.strictEqual(response.status, 400)
    })

    test('debe devolver 400 con titulo que no sea string', async () => {
      const response = await fetch(`${BASE_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: 12345, empresa: 'Empresa Test', ubicacion: 'Remoto' })
      })
      assert.strictEqual(response.status, 400)
    })

    test('debe devolver 201 sin campo descripcion', async () => {
      const jobData = {
        titulo: 'Trabajo sin descripcion',
        empresa: 'Empresa Test',
        ubicacion: 'Remoto'
      }

      const response = await fetch(`${BASE_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      })
      assert.strictEqual(response.status, 201)

      const body = await response.json()
      assert.ok(body.id, 'El trabajo creado debe tener un id generado')
      assert.strictEqual(body.titulo, jobData.titulo)
      assert.strictEqual(body.empresa, jobData.empresa)
      assert.strictEqual(body.ubicacion, jobData.ubicacion)
    })
  })
})

describe('GET /jobs/:id', () => {
  test('debe devolver el trabajo con ID especificado', async () => {
    const response = await fetch(`${BASE_URL}/jobs/${testJob2.id}`)
    assert.strictEqual(response.status, 200)

    const body = await response.json()
    assert.strictEqual(body.id, testJob2.id)
    assert.strictEqual(body.titulo, testJob2.titulo)
  })

  test('debe enviar 404 cuando el ID no existe', async () => {
    const response = await fetch(`${BASE_URL}/jobs/12345-67890`)
    assert.strictEqual(response.status, 404)

    const body = await response.json()
    assert.ok(body.error, 'La respuesta debe contener un campo error')
  })
})

describe('PUT /jobs/:id', () => {
  test('debe recibir 204 y actualizar el trabajo', async () => {
    const jobData = {
      titulo: 'Título Reemplazado por PUT',
      empresa: 'Empresa Reemplazada',
      ubicacion: 'Barcelona',
      descripcion: 'Descripción reemplazada por PUT',
      data: { technology: ['vue', 'typescript'], modalidad: 'remoto', nivel: 'junior' }
    }

    const response = await fetch(`${BASE_URL}/jobs/${testJob3.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)
    })
    assert.strictEqual(response.status, 204)

    const getResponse = await fetch(`${BASE_URL}/jobs/${testJob3.id}`)
    assert.strictEqual(getResponse.status, 200)

    const body = await getResponse.json()
    assert.strictEqual(body.id, testJob3.id, 'El ID debe permanecer igual')
    assert.strictEqual(body.titulo, jobData.titulo)
    assert.strictEqual(body.empresa, jobData.empresa)
    assert.strictEqual(body.ubicacion, jobData.ubicacion)
    assert.strictEqual(body.descripcion, jobData.descripcion)
    assert.deepStrictEqual(body.data, jobData.data)
  })

  test('debe devolver 404 cuando el ID no existe', async () => {
    const response = await fetch(`${BASE_URL}/jobs/12345-67890`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: 'Título de Test', empresa: 'Empresa Test', ubicacion: 'Remoto' })
    })
    assert.strictEqual(response.status, 404)
  })
})

describe('PATCH /jobs/:id', () => {
  test('debe recibir 204 y actualizar solo los campos enviados', async () => {
    const originalResponse = await fetch(`${BASE_URL}/jobs/${testJob4.id}`)
    assert.strictEqual(originalResponse.status, 200)
    const originalJob = await originalResponse.json()

    const patchData = {
      titulo: 'Título Actualizado por PATCH',
      ubicacion: 'Valencia'
    }

    const response = await fetch(`${BASE_URL}/jobs/${testJob4.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patchData)
    })
    assert.strictEqual(response.status, 204)

    const getResponse = await fetch(`${BASE_URL}/jobs/${testJob4.id}`)
    assert.strictEqual(getResponse.status, 200)

    const body = await getResponse.json()
    assert.strictEqual(body.titulo, patchData.titulo, 'El título debe ser actualizado')
    assert.strictEqual(body.ubicacion, patchData.ubicacion, 'La ubicación debe ser actualizada')
    assert.strictEqual(body.empresa, originalJob.empresa, 'La empresa debe permanecer sin cambios')
    assert.strictEqual(body.descripcion, originalJob.descripcion, 'La descripción debe permanecer sin cambios')
    assert.deepStrictEqual(body.data, originalJob.data, 'Los datos deben permanecer sin cambios')
  })

  test('debe devolver 404 cuando el ID no existe', async () => {
    const response = await fetch(`${BASE_URL}/jobs/12345-67890`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: 'Título de Test' })
    })
    assert.strictEqual(response.status, 404)
  })
})

describe('DELETE /jobs/:id', () => {
  test('debe recibir 204 y eliminar el trabajo', async () => {
    const response = await fetch(`${BASE_URL}/jobs/${testJobDelete.id}`, {
      method: 'DELETE'
    })
    assert.strictEqual(response.status, 204)

    const getResponse = await fetch(`${BASE_URL}/jobs/${testJobDelete.id}`)
    assert.strictEqual(getResponse.status, 404)
  })

  test('debe devolver 404 cuando el ID no existe', async () => {
    const response = await fetch(`${BASE_URL}/jobs/12345-67890`, {
      method: 'DELETE'
    })
    assert.strictEqual(response.status, 404)
  })
})
