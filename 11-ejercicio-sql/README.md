# Ejercicio: Base de datos con SQL

Hola! Bienvenido al ejercicio del módulo de SQL, ¡el antepenúltimo módulo del bootcamp! Nos alegra mucho que hayas llegado hasta aquí.

En este ejercicio vas a aplicar todo lo aprendido sobre **SQL** y **conexión de una base de datos con un backend**.

Vamos a trabajar con:

- **SQL**
- Librería muy conocida llamada `better-sqlite3`
- Crear un seed para levantar la base de datos con los datos iniciales
- Hacer migración del JSON a base de Datos
- Además de aplicar todo lo aprendido en el módulo

Recordatorio: El proyecto está escrito en **TypeScript** y se ejecuta con `tsx`.

## Estructura del proyecto

```text
├── app.ts              # Aplicación Express (ya configurada)
├── config.ts           # Configuración del puerto
├── types.ts            # Tipos e interfaces TypeScript
├── jobs.json           # Datos iniciales en JSON (referencia)
├── tsconfig.json       # Configuración de TypeScript
├── db/
│   ├── database.ts   # 👈 Aquí crearás la conexión a SQLite
│   └── seed.ts         # 👈 Aquí crearás las tablas e insertarás datos
├── models/
│   └── job.ts          # 👈 Modelo actual (lee del JSON, hay que migrar a SQL)
├── controllers/
│   └── jobs.ts         # Controladores (ya implementados)
├── routes/
│   └── jobs.ts         # Rutas (ya implementadas)
└── middlewares/
    └── cors.ts         # Middleware de CORS (ya implementado)
```

## ¿Qué está implementado?

La API ya funciona con estos endpoints:

- **GET /jobs** — Listar jobs con filtros opcionales y paginación
- **GET /jobs/:id** — Obtener un job por ID
- **POST /jobs** — Crear un nuevo job
- **PUT /jobs/:id** — Actualizar un job existente
- **DELETE /jobs/:id** — Eliminar un job

Ahora mismo, el modelo (`models/job.ts`) lee los datos desde `jobs.json`. Tu tarea es que **toda la API funcione contra una base de datos SQLite real** sin cambiar ni los controladores ni las rutas.

## Tipos disponibles (`types.ts`)

En el archivo `types.ts` tienes definidos todos los tipos que necesitas:

---

## Tarea 1: Conexión a la base de datos (`db/database.ts`)

Configura la conexión a SQLite usando `better-sqlite3`.

### Requisitos

1. Importar `Database` de `better-sqlite3` (verás que ya está definido en `package.json`)
2. Crear una conexión a un archivo llamado `jobs.db`
3. Activar `PRAGMA journal_mode = WAL` para mejorar la concurrencia
4. Activar `PRAGMA foreign_keys = ON` para que las claves foráneas funcionen correctamente
5. Exportar la instancia de la base de datos como `export`

---

## Tarea 2: Crear el esquema de la base de datos (`db/seed.ts`)

Tu tarea será crear las tablas en la base de datos de tal manera que reflejen la estructura de los datos en `jobs.json`. Y luego rellenarla con datos.

Aquí hay dos maneras para rellenar, con datos estáticos, o con un script que lea `jobs.json` y los inserte. Puedes elegir cualquiera de las dos. Datos estáticos es más simple y rápido, mientras que el script es más robusto y escalable (puedes importar el json y por medio de un map, ir insertando cada job).

Empieza escribiendo las sentencias SQL para crear tres tablas con relaciones entre ellas. **Importante** que al crearlas se debe verificar que ya no existan. Si existen, no crearlas.

### Tabla `jobs`

| Columna     | Tipo | Restricciones                                                |
| ----------- | ---- | ------------------------------------------------------------ |
| id          | TEXT | PRIMARY KEY                                                  |
| title       | TEXT | NOT NULL                                                     |
| company     | TEXT | NOT NULL                                                     |
| location    | TEXT | NOT NULL                                                     |
| description | TEXT | NOT NULL                                                     |
| modality    | TEXT | NOT NULL, CHECK (modality IN ('remote', 'onsite', 'hybrid')) |
| level       | TEXT | NOT NULL, CHECK (level IN ('junior', 'mid', 'senior'))       |

### Tabla `job_technologies`

| Columna    | Tipo | Restricciones                                      |
| ---------- | ---- | -------------------------------------------------- |
| job_id     | TEXT | NOT NULL, FOREIGN KEY → jobs(id) ON DELETE CASCADE |
| technology | TEXT | NOT NULL                                           |

### Tabla `job_content`

| Columna          | Tipo | Restricciones                                      |
| ---------------- | ---- | -------------------------------------------------- |
| job_id           | TEXT | NOT NULL, FOREIGN KEY → jobs(id) ON DELETE CASCADE |
| description      | TEXT | NOT NULL                                           |
| id               | TEXT | PRIMARY KEY                                        |
| responsibilities | TEXT | NOT NULL                                           |
| requirements     | TEXT | NOT NULL                                           |
| about            | TEXT | NOT NULL                                           |

Y luego inserta los datos en las tablas. Para insertar los datos en las tablas, primero debes hacer un `prepare` y luego, por medio de un `transaction`, hacer un `run` por cada inserción.

---

## Tarea 3: Migrar el modelo a SQL (`models/job.ts`)

Este es el paso más importante del ejercicio y en donde cobra sentido todo el trabajo que hicimos aplicando la arquitectura MVC. Simplemente cambiando unas pocas líneas de código, estamos pasando de leer datos de un JSON a leer datos de una base de datos.

Tu trabajo:

1. Importa `db` desde `../db/database`
2. Completa `getAll`, `getById`, `create`, `update` y `delete` usando SQL

Si terminaste con esto, es momento de verificar que todo funcione.

---

## Verificar que funciona

### 1. Instalar dependencias

```bash
npm install
```

### 2. Ejecutar el seed

```bash
npm run seed
```

Deberías ver un mensaje confirmando que las tablas se crearon y los datos se insertaron.

### 3. Levantar el servidor

```bash
npm run dev
```

### 4. Probar los endpoints

```bash
# Listar todos los jobs
curl http://localhost:3000/jobs

# Filtrar por tecnología
curl http://localhost:3000/jobs?technology=react

# Filtrar por modalidad
curl http://localhost:3000/jobs?modality=remote

# Filtrar por nivel
curl http://localhost:3000/jobs?level=senior

# Combinar filtros
curl "http://localhost:3000/jobs?technology=react&modality=remote"

# Paginar resultados
curl "http://localhost:3000/jobs?limit=2&offset=0"

# Obtener un job por ID
curl http://localhost:3000/jobs/1

# Crear un job
curl -X POST http://localhost:3000/jobs \
  -H "Content-Type: application/json" \
  -d '{"title": "Data Engineer", "company": "Midu SL", "location": "Barcelona", "description": "Buscamos data engineer", "data": {"technology": ["python", "sql"], "modality": "remote", "level": "mid"}}'

# Actualizar un job
curl -X PUT http://localhost:3000/jobs/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Senior Frontend Developer"}'

# Eliminar un job
curl -X DELETE http://localhost:3000/jobs/1
```

### 5. Comprobar la persistencia

Para verificar que los datos persisten correctamente:

1. Crea un job nuevo con `POST`
2. Detén el servidor (`Ctrl + C`)
3. Vuelve a levantarlo con `npm run dev`
4. Haz `GET /jobs` y verifica que el job que creaste sigue ahí

Si los datos sobreviven al reinicio, tu base de datos está funcionando correctamente.

---

## ¿Dudas?

Recuerda que puedes:

- Revisar las clases del módulo de SQL
- Preguntar en Discord
- Usar el archivo `dudas.md` para dejar tus dudas por escrito

¡Mucho éxito con el ejercicio!
