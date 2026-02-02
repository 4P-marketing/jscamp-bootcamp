# Ejercicio: API REST con Express y patrón MVC

## Objetivo

¡Hola! Felicidades por llegar al último ejercicio de Node.js previo al módulo de Testing.

En este ejercicio vas a crear una API REST completa aplicando el **patrón MVC (Modelo-Vista-Controlador)**, siguiendo las mejores prácticas.

Trabajarás con los datos de jobs que te hemos dejado en `jobs.json` y con la estructura base de carpetas: `models`, `controllers` y `routes`.

## Estructura del proyecto

Tu proyecto ya tiene esta estructura:

```text
├── app.js              # Punto de entrada de la aplicación
├── jobs.json           # Base de datos en JSON con los trabajos
├── models/
│   └── jobs.js         # Lógica de acceso a datos
├── controllers/
│   └── jobs.js         # Lógica de negocio de los endpoints
├── routes/
│   └── jobs.js         # Definición de rutas
└── middlewares/
    └── cors.js         # Middleware de CORS
```

## Código base

En el archivo `app.js` encontrarás este código:

```js
import express from 'express'
import { jobsRouter } from './routes/jobs.js'

const PORT = 3000
const app = express()

app.use('/jobs', jobsRouter)

app.listen(PORT, () => {
  console.log(`Servidor levantado en http://localhost:${PORT}`)
})
```

También tienes el archivo `jobs.json` que te mencionamos anteriormente con datos de trabajos que servirá como base de datos.

## ¿Qué es el patrón MVC?

El MVC separa la aplicación en tres componentes:

- **Model (Modelo)**: Gestiona los datos. En este caso, lee y manipula el archivo `jobs.json`
- **Controller (Controlador)**: Contiene la lógica de negocio. Procesa las peticiones y decide qué responder
- **Routes (Rutas)**: Define los endpoints y los conecta con los controladores

## Tu tarea

Deberás implementar la lógica en los tres archivos principales siguiendo el patrón MVC usando **clases** o **funciones** (usaremos clases para explicar los ejercicios, pero también puedes usar funciones):

### 1. Model (`models/job.js`)

Aquí crearás una clase `JobModel` con métodos estáticos o funciones para:

- `getAll({ text, title, level, limit, technology, offset })` - Obtener todos los jobs aplicando filtros

- `getById(id)` - Obtener un job por ID

- `create({ titulo, empresa, ubicacion, descripcion, data, content })` - Crear un nuevo job

- `update(id, { titulo, empresa, ubicacion, descripcion, data, content })` - Actualizar un job

- `partialUpdate(id, { titulo, empresa, ubicacion, descripcion, data, content })` - Actualizar parcialmente un job

- `delete(id)` - Eliminar un job

### 2. Controller (`controllers/jobs.js`)

Aquí crearás una clase `JobController` con métodos estáticos que manejan las peticiones HTTP:

- `getAll(req, res)` - Maneja GET `/jobs`
- `getId(req, res)` - Maneja GET `/jobs/:id`
- `create(req, res)` - Maneja POST `/jobs`
- `update(req, res)` - Maneja PUT `/jobs/:id`
- `partialUpdate(req, res)` - Maneja PATCH `/jobs/:id`
- `delete(req, res)` - Maneja DELETE `/jobs/:id`

### 3. Routes (`routes/jobs.js`)

Aquí conectarás las rutas con los controladores.

### 4. Config (`config.js`)

Crea un archivo de configuración con constantes por defecto:

```js
export const DEFAULTS = {
  LIMIT_PAGINATION: 10,
  LIMIT_OFFSET: 0,
  PORT: 1234,
}
```

Esto servirá para que puedas usar los valores por defecto en los controladores y en el punto de entrada de la aplicación.

Siempre es bueno tener un archivo de configuración que pueda modificar el comportamiento de la aplicación sin necesidad de modificar el código.

---

## Primer ejercicio: GET - Listar todos los jobs con filtros

Implementa un endpoint que devuelva todos los trabajos con soporte para filtros y paginación.

### Requisitos

- **Método:** GET
- **Ruta:** `/jobs`
- **Query params opcionales:**
  - `title` - Filtra por título (case insensitive)
  - `text` - Busca en título y descripción (case insensitive)
  - `technology` - Filtra por tecnología específica
  - `limit` - Cantidad de resultados (default: 10)
  - `offset` - Desde qué posición empezar (default: 0)
- **Respuesta:** Objeto con `data`, `total`, `limit` y `offset`
- **Status code:** 200

### Ejemplo de respuesta

```json
{
  "data": [
    {
      "id": "7a4d1d8b-1e45-4d8c-9f1a-8c2f9a9121a4",
      "titulo": "Desarrollador de Software Senior",
      "empresa": "Tech Solutions Inc.",
      "ubicacion": "Remoto",
      "descripcion": "Buscamos un ingeniero de software con experiencia en desarrollo web...",
      "data": {
        "technology": ["react", "node", "javascript"],
        "modalidad": "remoto",
        "nivel": "senior"
      },
      "content": {
        "description": "Tech Solutions Inc. está buscando un Ingeniero de Software Senior...",
        "responsibilities": "- Diseñar, desarrollar y mantener aplicaciones web...",
        "requirements": "- Licenciatura en Informática o campo relacionado...",
        "about": "Tech Solutions Inc. es una empresa de tecnología innovadora..."
      }
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0
}
```

### Ejemplos de uso

```bash
# Todos los jobs (primeros 10)
GET /jobs

# Buscar por texto
GET /jobs?text=frontend

# Filtrar por tecnología
GET /jobs?technology=React

# Paginación
GET /jobs?limit=5&offset=10

# Combinar filtros
GET /jobs?text=developer&technology=Node.js&limit=20
```

---

## Segundo ejercicio: GET - Obtener un job por ID

Crea un endpoint para obtener un trabajo específico por su ID.

### Requisitos

- **Método:** GET
- **Ruta:** `/jobs/:id`
- **Respuesta:** El job encontrado o un error 404
- **Status code:** 200 si existe, 404 si no existe

### Ejemplo de respuesta exitosa

```json
{
  "id": "7a4d1d8b-1e45-4d8c-9f1a-8c2f9a9121a4",
  "titulo": "Desarrollador de Software Senior",
  "empresa": "Tech Solutions Inc.",
  "ubicacion": "Remoto",
  "descripcion": "Buscamos un ingeniero de software con experiencia en desarrollo web y conocimientos en JavaScript, React y Node.js...",
  "data": {
    "technology": ["react", "node", "javascript"],
    "modalidad": "remoto",
    "nivel": "senior"
  },
  "content": {
    "description": "Tech Solutions Inc. está buscando un Ingeniero de Software Senior...",
    "responsibilities": "- Diseñar, desarrollar y mantener aplicaciones web...",
    "requirements": "- Licenciatura en Informática o campo relacionado...",
    "about": "Tech Solutions Inc. es una empresa de tecnología innovadora..."
  }
}
```

### Ejemplo de respuesta de error

```json
{
  "error": "Job not found"
}
```

---

## Tercer ejercicio: POST - Crear un nuevo job

Implementa un endpoint para crear un nuevo trabajo.

### Requisitos

- **Método:** POST
- **Ruta:** `/jobs`
- **Body esperado:** Objeto JSON con `titulo`, `empresa`, `ubicacion`, `descripcion`, `data` y `content`
- **Respuesta:** El job creado con su ID generado
- **Status code:** 201

### Ejemplo de petición

```json
{
  "titulo": "Ingeniero DevOps",
  "empresa": "CloudTech",
  "ubicacion": "Remoto",
  "descripcion": "Buscamos un ingeniero DevOps con experiencia en contenedores y orquestación.",
  "data": {
    "technology": ["docker", "kubernetes", "aws"],
    "modalidad": "remoto",
    "nivel": "senior"
  },
  "content": {
    "description": "CloudTech está buscando un Ingeniero DevOps...",
    "responsibilities": "- Gestionar infraestructura cloud...",
    "requirements": "- Experiencia con Docker y Kubernetes...",
    "about": "CloudTech es una empresa líder en soluciones cloud..."
  }
}
```

### Ejemplo de respuesta

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "titulo": "Ingeniero DevOps",
  "empresa": "CloudTech",
  "ubicacion": "Remoto",
  "descripcion": "Buscamos un ingeniero DevOps con experiencia en contenedores y orquestación.",
  "data": {
    "technology": ["docker", "kubernetes", "aws"],
    "modalidad": "remoto",
    "nivel": "senior"
  },
  "content": {
    "description": "CloudTech está buscando un Ingeniero DevOps...",
    "responsibilities": "- Gestionar infraestructura cloud...",
    "requirements": "- Experiencia con Docker y Kubernetes...",
    "about": "CloudTech es una empresa líder en soluciones cloud..."
  }
}
```

---

## Cuarto ejercicio: PUT, PATCH y DELETE

### PUT - Actualizar un job completo

- **Método:** PUT
- **Ruta:** `/jobs/:id`
- **Descripción:** Reemplaza completamente un job existente

### PATCH - Actualizar parcialmente un job

- **Método:** PATCH
- **Ruta:** `/jobs/:id`
- **Descripción:** Actualiza solo algunos campos de un job

### DELETE - Eliminar un job

- **Método:** DELETE
- **Ruta:** `/jobs/:id`
- **Descripción:** Elimina un job del array

---

## Quinto ejercicio: Middleware de CORS

Implementa un middleware para manejar CORS usando el paquete `cors` de npm.

### Requisitos

- Crear un middleware en `middlewares/cors.js`
- Usar el paquete `cors` de npm
- Configurar orígenes aceptados
- Aplicar el middleware en `app.js`

Las orígenes aceptados son:

- `http://localhost:3000`
- `http://localhost:1234`
- `https://midu.dev`
- `http://jscamp.dev`
- `http://localhost:5173`

---

## Probando tu API

Puedes probar tu API usando diferentes herramientas:

### Con curl

```bash
# GET - Listar todos los jobs (primeros 10)
curl http://localhost:1234/jobs

# GET - Listar con filtros
curl "http://localhost:1234/jobs?text=frontend&limit=5"

# GET - Filtrar por tecnología
curl "http://localhost:1234/jobs?technology=React"

# GET - Con paginación
curl "http://localhost:1234/jobs?limit=20&offset=10"

# GET - Obtener job por ID
curl http://localhost:1234/jobs/1

# POST - Crear job
curl -X POST http://localhost:1234/jobs \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Full Stack Developer","empresa":"TechStart","ubicacion":"Valencia","data":{"descripcion":"Desarrollador full stack","tecnologias":["React","Node.js"]}}'
```

### Con herramientas gráficas

- **Bruno**: https://www.usebruno.com/

---

## Estructura final del proyecto

Al completar el ejercicio, tu proyecto debería tener esta estructura:

```text
├── app.js                    # Servidor Express configurado
├── config.js                 # Constantes y configuración
├── jobs.json                 # Base de datos en JSON
├── models/
│   └── job.js               # Clase JobModel con métodos estáticos
├── controllers/
│   └── jobs.js              # Clase JobController con métodos estáticos
├── routes/
│   └── jobs.js              # Router con todas las rutas
└── middlewares/
    └── cors.js              # Middleware de CORS configurado
```

## Ventajas del patrón MVC

Al completar este ejercicio habrás visto las ventajas de usar MVC:

- **Mantenibilidad**: Cada archivo tiene una responsabilidad clara
- **Escalabilidad**: Puedes añadir nuevos recursos fácilmente
- **Testabilidad**: Puedes probar cada capa de forma independiente
- **Reutilización**: La lógica del modelo puede usarse en diferentes controladores

## ¿Dudas?

Recuerda que puedes:

- Revisar las clases del módulo sobre Backend con Node.js y Express
- Consultar en Discord
- Poner tus dudas en `dudas.md`

¡Mucho éxito con el ejercicio, y como siempre... A mover las manitas!
