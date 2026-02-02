# Ejercicio: API con Node.js

## Objetivo

¡Hola! Felicidades por llegar hasta aquí.

En este ejercicio vas a crear una API completa, simulando la gestión de usuarios.

## Código base

En el archivo `server.js` vas a encontrar este código:

```js
import { createServer } from 'node:http'

process.loadEnvFile()

const port = process.env.PORT || 3000

const server = createServer((req, res) => {
  // TODO: Aquí irá la lógica del servidor
})

server.listen(port, () => {
  const address = server.address()
  console.log(`Servidor escuchando en http://localhost:${address.port}`)
})
```

También vas a encontrar un array de usuarios que van a servir como base de datos.

Tu tarea sera dentro de la función `createServer` implementar la lógica de:

- Obtener todos los usuarios
- Filtrado de usuarios por nombre
- Filtrado de usuarios por limit y offset
- Filtrado de usuarios por edad minima y maxima
- Crear un nuevo usuario
- Health check
- Manejo de rutas no encontradas

Lo explicaremos paso a paso en cada ejercicio:

## Primer ejercicio: GET - Listar todos los usuarios

Crea un endpoint que devuelva todos los usuarios cuando se haga una petición GET a `/users`.

### Requisitos

- **Método:** GET
- **Ruta:** `/users`
- **Respuesta:** Array con todos los usuarios en formato JSON
- **Status code:** 200

### Ejemplo de respuesta

```json
[
  {
    "id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    "name": "Miguel",
    "age": 28
  },
  {
    "id": "f6e5d4c3-b2a1-4f5e-6d7c-8b9a0e1f2a3b",
    "name": "Mateo",
    "age": 34
  }
]
```

**Importante:** Recuerda usar `JSON.stringify()` para convertir el array de usuarios a una cadena JSON antes de enviarlo con `res.end()`. Y también recuerda configurar el header de la respuesta para indicar que devuelves JSON.

---

## Segundo ejercicio: POST - Crear un nuevo usuario

Crea un endpoint para agregar un nuevo usuario al array.

### Requisitos

- **Método:** POST
- **Ruta:** `/users`
- **Body esperado:** Objeto JSON con `name` y `age`
- **Respuesta:** El usuario creado (incluyendo el `id` generado)
- **Status code:** 201

### Ejemplo de petición

```json
{
  "name": "María",
  "age": 27
}
```

### Ejemplo de respuesta

```json
{
  "id": "nuevo-id-generado",
  "name": "María",
  "age": 27
}
```

**Importante:**

- Usa `crypto.randomUUID()` para generar un ID único
- Recuerda importar: `import { randomUUID } from 'node:crypto'`
- Usa `await json(req)` para obtener los datos del body

## Tercer ejercicio: Health Check

Crea un endpoint para verificar el estado del servidor.

### Requisitos

- **Método:** GET
- **Ruta:** `/health`
- **Respuesta:** Objeto con el estado del servidor y tiempo de actividad
- **Status code:** 200

### Ejemplo de respuesta

```json
{
  "status": "ok",
  "uptime": 123.456
}
```

**Importante:** Usa `process.uptime()` para obtener el tiempo que lleva el servidor ejecutándose en segundos.

---

## Cuarto ejercicio: Manejo de rutas no encontradas

Implementa un manejador para cuando el usuario intente acceder a una ruta que no existe.

### Requisitos

- **Respuesta:** Mensaje de error indicando que la ruta no existe
- **Status code:** 404

### Ejemplo de respuesta

```json
{
  "error": "Ruta no encontrada"
}
```

---

## Quinto ejercicio: Filtrado de usuarios

Ahora vamos a mejorar el endpoint GET `/users` para que acepte parámetros de consulta (query parameters) y pueda filtrar los resultados.

### Requisitos

El endpoint `/users` debe soportar los siguientes filtros opcionales mediante query parameters:

1. **Filtrado por nombre** (`?name=`)
2. **Paginación** (`?limit=` y `?offset=`)
3. **Filtrado por rango de edad** (`?minAge=` y `?maxAge=`)

### Parte 1: Filtrado por nombre

Permite buscar usuarios cuyo nombre contenga el texto proporcionado (sin distinguir mayúsculas/minúsculas).

**Ejemplo de petición:**

```
GET /users?name=miguel
```

**Ejemplo de respuesta:**

```json
[
  {
    "id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    "name": "Miguel",
    "age": 28
  }
]
```

### Parte 2: Paginación con limit y offset

Implementa paginación para limitar la cantidad de resultados y poder navegar por páginas.

- **`limit`**: Cantidad máxima de usuarios a devolver
- **`offset`**: Cantidad de usuarios a saltar desde el inicio

**Ejemplo de petición:**

```
GET /users?limit=3&offset=2
```

**Ejemplo de respuesta:**

```json
[
  {
    "id": "9a8b7c6d-5e4f-4a3b-2c1d-0e9f8a7b6c5d",
    "name": "Pablo",
    "age": 22
  },
  {
    "id": "3c4d5e6f-7a8b-4c9d-0e1f-2a3b4c5d6e7f",
    "name": "Lucía",
    "age": 31
  },
  {
    "id": "7b8c9d0e-1f2a-4b3c-4d5e-6f7a8b9c0d1e",
    "name": "Ana",
    "age": 26
  }
]
```

**Importante:**

- Usa `.slice(offset, offset + limit)` para obtener el subconjunto de usuarios
- Convierte los valores a números con `Number()`
- Si no se proporciona `limit` u `offset`, no apliques paginación

### Parte 3: Filtrado por rango de edad

Permite filtrar usuarios por edad mínima y/o máxima.

- **`minAge`**: Edad mínima (inclusive)
- **`maxAge`**: Edad máxima (inclusive)

**Ejemplo de petición:**

```
GET /users?minAge=25&maxAge=30
```

**Ejemplo de respuesta:**

```json
[
  {
    "id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    "name": "Miguel",
    "age": 28
  },
  {
    "id": "7b8c9d0e-1f2a-4b3c-4d5e-6f7a8b9c0d1e",
    "name": "Ana",
    "age": 26
  },
  {
    "id": "5d6e7f8a-9b0c-4d1e-2f3a-4b5c6d7e8f9a",
    "name": "Juan",
    "age": 29
  },
  {
    "id": "2a3b4c5d-6e7f-4a8b-9c0d-1e2f3a4b5c6d",
    "name": "Sofía",
    "age": 25
  },
  {
    "id": "0e1f2a3b-4c5d-4e6f-7a8b-9c0d1e2f3a4b",
    "name": "Diego",
    "age": 30
  }
]
```

**Importante:**

- Usa `.filter()` para verificar que `user.age >= minAge` y `user.age <= maxAge`
- Convierte los valores a números
- Si solo se proporciona uno de los dos parámetros, aplica solo ese filtro

### Combinando filtros

Los filtros deben poder combinarse. Por ejemplo:

```
GET /users?name=a&minAge=25&maxAge=35&limit=2&offset=0
```

Esto debería devolver los primeros 2 usuarios cuyo nombre contenga "a" y tengan entre 25 y 35 años.

---

## Probando tu API

Puedes probar tu API usando diferentes herramientas:

### Con curl

```bash
# GET - Listar usuarios
curl http://localhost:3000/users

# POST - Crear usuario
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"María","age":27}'

# Health check
curl http://localhost:3000/health
```

### Con herramientas gráficas

- **Bruno**: https://www.usebruno.com/

---

## ¿Dudas?

Recuerda que puedes:

- Revisar las clases del módulo
- Consultar en Discord
- Documentar tus dudas en `dudas.md`

¡Mucho éxito con el ejercicio, y como siempre... A mover las manitas!
