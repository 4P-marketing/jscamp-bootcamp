# Ejercicio: Testing de API REST

## Objetivo

¡Hola! Felicidades por llegar al módulo de Testing.

En este ejercicio vas a aplicar todo lo aprendido sobre **testing de APIs**, **validación con Zod** y **buenas prácticas de testing**. Trabajarás sobre una API REST de jobs que ya tiene implementada toda la lógica de negocio (la que hemos hecho en el módulo anterior), pero le falta lo más importante: **tests que garanticen que funciona correctamente**.

## Estructura del proyecto

Tu proyecto ya tiene esta estructura implementada:

```text
├── app.js              # Aplicación Express (ya configurada para testing)
├── app.test.js         # Aquí escribirás tus tests
├── config.js           # Configuración de la aplicación
├── jobs.json           # Base de datos en JSON
├── models/
│   └── job.js         # Modelo con toda la lógica de datos
├── controllers/
│   └── jobs.js        # Controladores con la lógica de negocio
├── routes/
│   └── jobs.js        # Definición de rutas
├── middlewares/
│   └── cors.js        # Middleware de CORS
└── schemas/
    └── jobs.js        # Aquí crearás el schema de validación con Zod
```

## ¿Qué está implementado?

- **GET /jobs** - Listar jobs con filtros y paginación
- **GET /jobs/:id** - Obtener un job por ID
- **POST /jobs** - Crear un nuevo job
- **PUT /jobs/:id** - Actualizar un job completo
- **PATCH /jobs/:id** - Actualizar parcialmente un job
- **DELETE /jobs/:id** - Eliminar un job

## Tarea 1: Schema de validación (`schemas/jobs.js`)

Crear un schema con Zod que valide la estructura de los jobs:

- Campos requeridos: `titulo`, `empresa`, `ubicacion`
- Campos opcionales: `descripcion`, `content`
- Validaciones específicas:
  - `titulo`: string, mínimo 3 caracteres, máximo 100 caracteres
  - `data.technology`: array de strings
  - `data.modalidad`: string opcional
  - `data.nivel`: string opcional

Exportar dos funciones:

- `validateJob(input)` - Valida un job completo
- `validatePartialJob(input)` - Valida un job parcial (para PATCH)

Estas dos funciones debes transformarlas en un middleware dentro de `routes/jobs.js`.

- `validateJob` se usará para los endpoints `POST` y `PUT`.
- `validatePartialJob` se usará para el endpoint `PATCH`.

## Tarea 2: Tests de integración (`app.test.js`)

Escribir tests completos para todos los endpoints. Debes:

- Usar `node:test` (sin dependencias externas)
- Usar `node:assert` para las aserciones
- Levantar el servidor antes de los tests con `before()`
- Cerrar el servidor después de los tests con `after()`
- Usar un puerto diferente al de desarrollo (ej: 5678)

---

### Tests para GET /jobs

Escribe tests que verifiquen el funcionamiento del endpoint de listado de jobs.

#### Tests requeridos

1. **Debe responder con 200 y un array de trabajos**
   - Verificar status code 200
   - Verificar que `json.data` es un array

2. **Debe filtrar trabajos por tecnología**
   - Hacer petición con `?technology=react`
   - Verificar que todos los jobs devueltos incluyen esa tecnología en `data.technology`

3. **Debe respetar el límite de resultados**
   - Hacer petición con `?limit=2`
   - Verificar que `json.limit === 2`
   - Verificar que `json.data.length === 2`

4. **Debe aplicar offset correctamente**
   - Hacer petición con `?offset=1`
   - Verificar que el primer resultado es el segundo job del JSON
   - Puedes usar el ID `d35b2c89-5d60-4f26-b19a-6cfb2f1a0f57` para verificar

### Tests para POST /jobs

Escribe tests para verificar la creación de jobs y la validación con Zod.

#### Tests requeridos

1. **El nuevo trabajo se añade correctamente con buen formato**
   - Crear un job válido
   - Verificar status code 201
   - Verificar que el job devuelto tiene un `id` generado
   - Verificar que los datos coinciden con lo enviado

2. **La petición es validada correctamente**
   - Probar con `titulo` de menos de 3 caracteres → debe devolver 400
   - Probar con `titulo` de más de 100 caracteres → debe devolver 400
   - Probar sin campo `titulo` → debe devolver 400
   - Probar con `titulo` que no sea string → debe devolver 400
   - Probar sin campo `descripcion` (es opcional) → debe devolver 201

### Tests para GET /jobs/:id

Escribe tests para verificar la obtención de un job específico.

#### Tests requeridos

1. **Debe devolver el trabajo con ID especificado**
   - Usar un ID válido del JSON (ej: `d35b2c89-5d60-4f26-b19a-6cfb2f1a0f57`)
   - Verificar status code 200
   - Verificar que el `id` del job devuelto coincide

2. **Debe enviar 404 cuando el ID no existe**
   - Usar un ID inválido
   - Verificar status code 404
   - Verificar que la respuesta contiene un campo `error`

### Tests para PUT /jobs/:id

Escribe tests para verificar la actualización completa de un job.

#### Tests requeridos

1. **Debe recibir 204 y actualizar el trabajo**
   - Usar un ID válido
   - Enviar un job completo con datos nuevos
   - Verificar status code 204
   - Hacer un GET del mismo job y verificar que se actualizó

2. **Debe devolver 404 cuando el ID no existe**
   - Usar un ID inválido
   - Verificar status code 404

**Importante:** PUT reemplaza **todos** los campos del recurso.

### Tests para PATCH /jobs/:id

Escribe tests para verificar la actualización parcial de un job.

#### Tests requeridos

1. **Debe recibir 204 y actualizar solo los campos enviados**
   - Usar un ID válido (ej: `f62d8a34-923a-4ac2-9b0b-14e0ac2f5405`)
   - Enviar solo algunos campos (ej: `titulo` y `ubicacion`)
   - Verificar status code 204
   - Hacer un GET y verificar que solo esos campos cambiaron

2. **Debe devolver 404 cuando el ID no existe**
   - Usar un ID inválido
   - Verificar status code 404

**Importante:** PATCH solo actualiza los campos enviados, mantiene el resto sin cambios.

### Tests para DELETE /jobs/:id

Escribe tests para verificar la eliminación de un job.

#### Tests requeridos

1. **Debe recibir 204 y eliminar el trabajo**
   - Usar un ID válido (ej: `f62d8a34-923a-4ac2-9b0b-14e0ac2f5405`)
   - Verificar status code 204
   - Hacer un GET del mismo job y verificar que devuelve 404

2. **Debe devolver 404 cuando el ID no existe**
   - Usar un ID inválido
   - Verificar status code 404

---

## Consejos importantes

1. **Usa describe() para agrupar tests**
   - Agrupa los tests por endpoint
   - Facilita la lectura

2. **Nombres descriptivos**
   - Los nombres de los tests deben explicar qué verifican

3. **assert.strictEqual vs assert.ok**
   - `strictEqual`: compara valores con `===`
   - `ok`: verifica que el valor sea truthy

4. **Orden de los tests**
   - Los tests deben ser independientes
   - No deben depender del orden de ejecución
   - Cada test debe poder ejecutarse solo

5. **IDs de prueba**
   - Usa IDs que existen en el `jobs.json`

## ¿Dudas?

Recuerda que puedes:

- Revisar las clases del módulo sobre Testing
- Consultar en Discord
- Documentar tus dudas en `dudas.md`

¡Mucho éxito con el ejercicio, y como siempre... A mover las manitas y seguir aprendiendo!
