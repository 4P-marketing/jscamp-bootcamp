import { createServer } from 'node:http'
import { uptime } from 'node:process'
import { json } from 'node:stream/consumers'
import { randomUUID } from 'node:crypto'

process.loadEnvFile()

const port = process.env.PORT || 3000

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode
  res.writeHead(statusCode, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(data))
}

function filterUsers(users, name, minAge, maxAge) {
  // Podemos simplificar la lectura con una ternaria y verificando los match por separado
  return users.filter((user) => {
    // 1. si tenemos name, filtramos por nombre
    const matchName = name ? user.name.toLowerCase().includes(name.toLowerCase()) : true
    // 2. si tenemos minAge, filtramos por edad minima
    const matchMinAge = minAge ? user.age >= Number(minAge) : true
    // 3. si tenemos maxAge, filtramos por edad maxima
    const matchMaxAge = maxAge ? user.age <= Number(maxAge) : true

    return matchName && matchMinAge && matchMaxAge
  })

  /* return users.filter(user => {
    let isMatch = true
    if (name) {
      isMatch = isMatch && user.name.toLowerCase().includes(name.toLowerCase())
    }
    if (minAge) {
      isMatch = isMatch && user.age >= Number(minAge)
    }
    if (maxAge) {
      isMatch = isMatch && user.age <= Number(maxAge)
    }
    return isMatch
  }) */
}

const server = createServer(async (req, res) => { 
  const { method, url, scheme, headers } = req 
  const protocol = scheme || 'http'
  // Está muy bien! Se puede simplificar usando la `url` y dividirla con un split por el valor `?`, pero es solo otra manera de hacerlo, si? Lo hiciste genial!
  const { pathname, searchParams } = new URL(url, `${protocol}://${headers.host}`)

  if (method === 'GET') {
    if (pathname === '/users') {
      const name = searchParams.get('name')
      const minAge = searchParams.get('minAge')
      const maxAge = searchParams.get('maxAge')
      const limit = Number(searchParams.get('limit')) || users.length
      const offset = Number(searchParams.get('offset')) || 0
      return sendJson(
        res, 
        200, 
        filterUsers(users, name, minAge, maxAge).slice(offset, offset + limit)
      )
    }
    
    // No hace falta usar else if, ya que si entra al `if`, termina la ejecución por el return
    if (pathname === '/health') {
      return sendJson(res, 200, { status: 'ok', uptime: uptime() })
    }
    
    return sendJson(res, 404, { error: 'Ruta no encontrada' })
  } 
  
  // No hace falta el else if, por la misma razón que en el GET. Si entra en el GET, termina la ejecución por el return
  if (method === 'POST' ){
    if (pathname === '/users') {
      const contentType = req.headers['content-type']
      if (!contentType || !contentType.includes('application/json')) {
        return sendJson(res, 415, { error: 'Tipo no soportado. Se esperaba application/json' })
      }
      try {
        const body = await json(req)
        console.log('Nuevo usuario recibido:', body)
        const newUser = { id: randomUUID(), ...body }
        users.push(newUser)
        return sendJson(res, 201, {message: "Usuario creado", user: newUser})
      } catch (error) {
        return sendJson(res, 400, { error: 'JSON inválido' })
      }
    }

    // Si no entra en /users, termina la ejecución por el return de aquí, no hace falta el else
    return sendJson(res, 404, { error: 'Ruta no encontrada' })
  }

  return sendJson(res, 405, { error: 'Método no permitido' })
})

server.listen(port, () => {
  const address = server.address()
  console.log(`Servidor escuchando en http://localhost:${address.port}`)
})

const users = [
  {
    id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    name: 'Miguel',
    age: 28,
  },
  {
    id: 'f6e5d4c3-b2a1-4f5e-6d7c-8b9a0e1f2a3b',
    name: 'Mateo',
    age: 34,
  },
  {
    id: '9a8b7c6d-5e4f-4a3b-2c1d-0e9f8a7b6c5d',
    name: 'Pablo',
    age: 22,
  },
  {
    id: '3c4d5e6f-7a8b-4c9d-0e1f-2a3b4c5d6e7f',
    name: 'Lucía',
    age: 31,
  },
  {
    id: '7b8c9d0e-1f2a-4b3c-4d5e-6f7a8b9c0d1e',
    name: 'Ana',
    age: 26,
  },
  {
    id: '5d6e7f8a-9b0c-4d1e-2f3a-4b5c6d7e8f9a',
    name: 'Juan',
    age: 29,
  },
  {
    id: '2a3b4c5d-6e7f-4a8b-9c0d-1e2f3a4b5c6d',
    name: 'Sofía',
    age: 25,
  },
  {
    id: '8f9a0b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c',
    name: 'Carlos',
    age: 37,
  },
  {
    id: '4c5d6e7f-8a9b-4c0d-1e2f-3a4b5c6d7e8f',
    name: 'Elena',
    age: 23,
  },
  {
    id: '0e1f2a3b-4c5d-4e6f-7a8b-9c0d1e2f3a4b',
    name: 'Diego',
    age: 30,
  },
]
