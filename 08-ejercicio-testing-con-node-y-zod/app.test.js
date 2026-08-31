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
import { after, before, describe, test } from 'node:test'
// Quitamos 'rejects' porque assert.rejects() es una aserción, NO sirve para rechazar promesas
// import assert, { rejects } from 'node:assert'
import assert from 'node:assert'
import app from './app.js'
import mockJobs from './jobs.json' with { type: 'json' }

// Muy bien implementado esto!
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
  return new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) return reject(err)
      resolve()
    })
  })
})

// Para evitar código repetido, hicimos unos helpers que ayudan a poder reutilizar código dentro de nuestros tests.
// Esto es muy útil en este tipo de trabajos en donde cada test individual de entrada repite muchas cosas, y se hace tedioso para hacer.
const requestAndCheckStatus = async ({ method, path, body, status }) => {
  // Le damos al developer la posibilidad de pasar el path con o sin '/'
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const response = await fetch(`${BASE_URL}${normalizedPath}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined
  })
  assert.strictEqual(response.status, status)

  // Esto es para las peticiones de método PUT y PATCH, que no devuelven cuerpo
  if (status === 204) return null
  return response.json()
}

// Ahora como tenemos creado los helpers, podemos usar este tipo de funciones para simplificar aún más nuestros tests y el código
const getJob = ({ path, status }) => requestAndCheckStatus({ method: 'GET', path, status })
const createJob = ({ path, body, status }) => requestAndCheckStatus({ method: 'POST', path, body, status })
const updateJob = ({ path, body, status }) => requestAndCheckStatus({ method: 'PUT', path, body, status })
const partialUpdateJob = ({ path, body, status }) => requestAndCheckStatus({ method: 'PATCH', path, body, status })
const deleteJob = ({ path, status }) => requestAndCheckStatus({ method: 'DELETE', path, status })

describe('GET /jobs', () => {
  test('debe responder con 200 y un array de trabajos', async () => {
    const body = await getJob({ path: '/jobs', status: 200 })
    assert.ok(Array.isArray(body.data), 'json.data debe ser un array')
  })

  test('debe filtrar trabajos por tecnología', async () => {
    const body = await getJob({ path: '/jobs?technology=react', status: 200 })
    assert.ok(body.data.length > 0, 'Debe encontrar trabajos con tecnología react')
    body.data.forEach(job => {
      assert.ok(job.data.technology.includes('react'), 'Todos los trabajos devueltos deben incluir la tecnología react')
    })
  })

  test('debe respetar el límite de resultados', async () => {
    const body = await getJob({ path: '/jobs?limit=2', status: 200 })
    assert.strictEqual(body.limit, 2)
    assert.strictEqual(body.data.length, 2)
  })

  test('debe aplicar offset correctamente', async () => {
    const body = await getJob({ path: '/jobs?offset=1', status: 200 })
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

    const body = await createJob({ path: '/jobs', body: jobData, status: 201 })
    assert.ok(body.id, 'El trabajo devuelto debe tener un id generado')
    assert.strictEqual(body.titulo, jobData.titulo)
    assert.strictEqual(body.empresa, jobData.empresa)
    assert.strictEqual(body.ubicacion, jobData.ubicacion)
    assert.strictEqual(body.descripcion, jobData.descripcion)
    assert.deepStrictEqual(body.data, jobData.data)
  })

  describe('la petición es validada correctamente', () => {
    test('debe devolver 400 con titulo de menos de 3 caracteres', async () => {
      await createJob({ path: '/jobs', body: { titulo: 'ab', empresa: 'Empresa Test', ubicacion: 'Remoto' }, status: 400 })
    })

    test('debe devolver 400 con titulo de más de 100 caracteres', async () => {
      await createJob({ path: '/jobs', body: { titulo: 'a'.repeat(101), empresa: 'Empresa Test', ubicacion: 'Remoto' }, status: 400 })
    })

    test('debe devolver 400 sin campo titulo', async () => {
      await createJob({ path: '/jobs', body: { empresa: 'Empresa Test', ubicacion: 'Remoto' }, status: 400 })
    })

    test('debe devolver 400 con titulo que no sea string', async () => {
      await createJob({ path: '/jobs', body: { titulo: 12345, empresa: 'Empresa Test', ubicacion: 'Remoto' }, status: 400 })
    })

    test('debe devolver 201 sin campo descripcion', async () => {
      // Agregamos 'data' para no dejar un job con `data: undefined` y romper otros tests
      // const jobData = { titulo, empresa, ubicacion } (sin 'data')
      const jobData = {
        titulo: 'Trabajo sin descripcion',
        empresa: 'Empresa Test',
        ubicacion: 'Remoto',
        data: { technology: ['javascript'] }
      }

      const body = await createJob({ path: '/jobs', body: jobData, status: 201 })
      assert.ok(body.id, 'El trabajo creado debe tener un id generado')
      assert.strictEqual(body.titulo, jobData.titulo)
      assert.strictEqual(body.empresa, jobData.empresa)
      assert.strictEqual(body.ubicacion, jobData.ubicacion)
    })
  })
})

describe('GET /jobs/:id', () => {
  test('debe devolver el trabajo con ID especificado', async () => {
    const body = await getJob({ path: `/jobs/${testJob2.id}`, status: 200 })
    assert.strictEqual(body.id, testJob2.id)
    assert.strictEqual(body.titulo, testJob2.titulo)
  })

  test('debe enviar 404 cuando el ID no existe', async () => {
    const body = await getJob({ path: '/jobs/12345-67890', status: 404 })
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

    // El 204 no devuelve cuerpo, por eso verificamos el cambio con un GET
    await updateJob({ path: `/jobs/${testJob3.id}`, body: jobData, status: 204 })

    const body = await getJob({ path: `/jobs/${testJob3.id}`, status: 200 })
    assert.strictEqual(body.id, testJob3.id, 'El ID debe permanecer igual')
    assert.strictEqual(body.titulo, jobData.titulo)
    assert.strictEqual(body.empresa, jobData.empresa)
    assert.strictEqual(body.ubicacion, jobData.ubicacion)
    assert.strictEqual(body.descripcion, jobData.descripcion)
    assert.deepStrictEqual(body.data, jobData.data)
  })

  test('debe devolver 404 cuando el ID no existe', async () => {
    await updateJob({ path: '/jobs/12345-67890', body: { titulo: 'Título de Test', empresa: 'Empresa Test', ubicacion: 'Remoto' }, status: 404 })
  })
})

describe('PATCH /jobs/:id', () => {
  test('debe recibir 204 y actualizar solo los campos enviados', async () => {
    // Guardamos el estado original para comprobar que el resto de campos no cambia
    const originalJob = await getJob({ path: `/jobs/${testJob4.id}`, status: 200 })

    const patchData = {
      titulo: 'Título Actualizado por PATCH',
      ubicacion: 'Valencia'
    }

    // El 204 no devuelve cuerpo, por eso verificamos el cambio con un GET
    await partialUpdateJob({ path: `/jobs/${testJob4.id}`, body: patchData, status: 204 })

    const body = await getJob({ path: `/jobs/${testJob4.id}`, status: 200 })
    assert.strictEqual(body.titulo, patchData.titulo, 'El título debe ser actualizado')
    assert.strictEqual(body.ubicacion, patchData.ubicacion, 'La ubicación debe ser actualizada')
    assert.strictEqual(body.empresa, originalJob.empresa, 'La empresa debe permanecer sin cambios')
    assert.strictEqual(body.descripcion, originalJob.descripcion, 'La descripción debe permanecer sin cambios')
    assert.deepStrictEqual(body.data, originalJob.data, 'Los datos deben permanecer sin cambios')
  })

  test('debe devolver 404 cuando el ID no existe', async () => {
    await partialUpdateJob({ path: '/jobs/12345-67890', body: { titulo: 'Título de Test' }, status: 404 })
  })
})

describe('DELETE /jobs/:id', () => {
  test('debe recibir 204 y eliminar el trabajo', async () => {
    // El 204 no devuelve cuerpo, por eso verificamos la eliminación con un GET
    await deleteJob({ path: `/jobs/${testJobDelete.id}`, status: 204 })

    await getJob({ path: `/jobs/${testJobDelete.id}`, status: 404 })
  })

  test('debe devolver 404 cuando el ID no existe', async () => {
    await deleteJob({ path: '/jobs/12345-67890', status: 404 })
  })
})
