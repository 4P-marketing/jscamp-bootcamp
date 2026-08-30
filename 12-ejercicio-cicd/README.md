# Ejercicio: CI/CD con GitHub Actions

¡Bienvenido al ejercicio del módulo de CI/CD! Ha llegado el momento de aplicar todo lo aprendido sobre **GitHub Actions**: workflows, eventos, triggers manuales, cron, ejecución en paralelo, dependencias entre jobs, composite actions, integración con Claude y estrategias de matriz.

En este ejercicio vas a construir desde cero los workflows de un proyecto real, paso a paso, hasta tener un pipeline de CI/CD completo y profesional.

## ¿Qué vas a construir?

Un monorepo con dos paquetes (`projects/frontend` y `projects/backend`) que ya están listos. Tu trabajo será crear **toda la configuración de GitHub Actions** que los valida automáticamente en cada cambio.

Nada de esto existe todavía en tu repositorio. Vas a crearlo tú.

## Estructura del proyecto

```text
12-ejercicio-cicd/
├── package.json                # Raíz del monorepo (scripts ya listos)
├── pnpm-workspace.yaml         # Define projects/* como paquetes del workspace
├── projects/
│   ├── frontend/               # Vite + React + Vitest
│   │   ├── package.json
│   │   ├── eslint.config.js
│   │   ├── vite.config.js
│   │   ├── index.html
│   │   └── src/
│   │       ├── App.jsx
│   │       ├── App.css
│   │       ├── main.jsx
│   │       ├── tasks.js
│   │       ├── App.test.jsx
│   │       ├── tasks.test.js
│   │       └── test/setup.js
│   └── backend/                # Express + Vitest + Supertest
│       ├── package.json
│       ├── eslint.config.js
│       └── src/
│           ├── app.js
│           ├── server.js
│           ├── tasks.js
│           └── test/
│               ├── app.test.js
│               └── tasks.test.js
└── .github/                    # 👈 Aquí crearás tus workflows y actions
    ├── workflows/
    └── actions/
```

## ¿Qué está implementado?

Los dos proyectos funcionan en local:
Ambos tienen scripts de `lint`, `test` y `build` listos para usar.

En la raíz del monorepo tienes `pnpm-workspace.yaml` (que apunta a `projects/*`) y un `package.json` con scripts de orquestación ya listos. Estos scripts son los que usarás dentro de tus workflows.

> **Importante**: ejecuta `pnpm install` desde la raíz de `12-ejercicio-cicd/` para que pnpm detecte el workspace e instale las dependencias de los dos paquetes.

---

## Tarea 1: Tu primer workflow (`Hello World`)

Crea el archivo `.github/workflows/01-hello.yml`.

### Requisitos

1. Nombre del workflow: `01 - Hello`
2. Debe poderse ejecutar **manualmente** desde la pestaña Actions (usa el evento adecuado)
3. Define **dos jobs** que se ejecuten en paralelo en runners `ubuntu-24.04`:
   - `saludar`: imprime `Hola desde GitHub Actions!`, muestra la fecha con `date` y lista los archivos con `ls -la`
   - `repo-files`: descarga el código del repositorio con `actions/checkout@v6` y lista los archivos con `ls -la`
4. Piensa: ¿por qué el segundo job necesita `actions/checkout` y el primero no?

### Verificación

Ejecútalo manualmente desde la pestaña Actions y comprueba que ambos jobs finalizan en verde.

---

## Tarea 2: Workflow manual con inputs

Crea el archivo `.github/workflows/02-manual.yml`.

### Requisitos

1. Nombre: `02 - Manual`
2. Debe ejecutarse manualmente y pedir al usuario **cuatro inputs**:
   - `logging_level`: nivel de log, obligatorio, con valor por defecto `info`
   - `environment`: entorno de despliegue, obligatorio
   - `dry_run`: ejecutar sin aplicar cambios, con valor por defecto `false`
   - `reason`: motivo de la ejecución, con valor por defecto `"Manual execution"`
3. Un único job `manual` en `ubuntu-24.04` que:
   - Imprima los cuatro inputs por pantalla usando **variables de entorno** (no interpolación directa en el `run`)
   - Tenga un step "Deploy" que **solo se ejecute si `dry_run` es false** y que imprima `Deploying to <environment>`
   - Tenga un step "Dry run" que **solo se ejecute si `dry_run` es true**

### Verificación

Ejecútalo varias veces desde la UI probando distintas combinaciones de inputs y comprueba que los condicionales funcionan.

---

## Tarea 3: Workflow programado con cron

Crea el archivo `.github/workflows/03-schedule.yml`.

### Requisitos

1. Nombre: `03 - Schedule`
2. Debe ejecutarse **todos los lunes a las 9 de la mañana** usando el evento `schedule` con la expresión cron adecuada
3. Un único job en `ubuntu-24.04` que imprima `Hola desde GitHub Actions!`
4. **Bonus**: añade un comentario en el YAML explicando qué significa cada uno de los cinco campos de la expresión cron que has usado

> **Truco**: no quieres esperar al lunes para verificarlo. Añade temporalmente el evento `workflow_dispatch` además de `schedule` para poder lanzarlo a mano durante las pruebas. Cuando termines, decide si lo dejas o lo quitas.

---

## Tarea 4: Reaccionar a eventos del repositorio

Crea el archivo `.github/workflows/04-events.yml`.

### Requisitos

1. Nombre: `04 - Events`
2. Debe dispararse en estos eventos: `issues` (cuando se abre o se reasigna), `issue_comment` (cuando se crea un comentario) y `pull_request_review_comment`
3. Un único job `inspect-event` en `ubuntu-24.04` con `permissions: issues: write` que:
   - Imprima el nombre del evento con `github.event_name`
   - Imprima el número de la issue con `github.event.issue.number`
   - Imprima el cuerpo del comentario con `github.event.comment.body` (cuando aplique)
4. Un step que **publique un comentario automático como bot** usando `gh issue comment` cuando se abra una issue, agradeciendo el aporte

### Verificación

Abre una issue de prueba en el repositorio y comprueba que el bot comenta automáticamente.

---

## Tarea 5: Pipeline de CI/CD completo con jobs en paralelo

Crea el archivo `.github/workflows/05-ci.yml`.

### Requisitos

1. Nombre: `05 - CI`
2. Debe dispararse en `push` a `main` y en `pull_request` contra `main`
3. Define **seis jobs**:
   - `frontend-lint`, `frontend-test`, `backend-lint`, `backend-test` se ejecutan **en paralelo**
   - `frontend-build` se ejecuta **solo si** `frontend-lint` y `frontend-test` han terminado bien
   - `backend-build` se ejecuta **solo si** `backend-lint` y `backend-test` han terminado bien
4. Cada job debe:
   - Usar `actions/checkout@v6`
   - Usar una **composite action** llamada `setup-pnpm-ci-cd` (la crearás en la Tarea 6) que prepare Node y pnpm
   - Ejecutar los scripts del monorepo con `pnpm lint:frontend`, `pnpm test:frontend`, etc.

### Verificación

Haz un push a `main` y comprueba que los seis jobs aparecen en el panel de Actions. Verifica también que si rompes un test, el job dependiente (build) no se ejecuta.

---

## Tarea 6: Composite action reutilizable

Crea el archivo `.github/actions/setup-pnpm-ci-cd/action.yml`.

### Requisitos

1. Nombre y descripción: `Setup pnpm and Node.js for CI/CD`
2. Dos inputs opcionales con valor por defecto:
   - `node-version`: por defecto `"24"`
   - `pnpm-version`: por defecto `"11"`
3. Tres steps:
   - `Setup pnpm` usando `pnpm/action-setup@v6` con `run_install: false`
   - `Setup Node.js` usando `actions/setup-node@v6` con la versión del input
   - `Install dependencies` que ejecute `pnpm install --frozen-lockfile` desde la raíz de `12-ejercicio-cicd/`
4. Declara `using: 'composite'`

### Verificación

La action se invoca en los jobs de la Tarea 5 con `uses: ./.github/actions/setup-pnpm-ci-cd`. Si la Tarea 5 funciona y los jobs usan esta action, está validada.

---

## Tarea 7 (Opcional): Matriz multiplataforma

Si te sientes con ganas, añade un job adicional al workflow `05-ci.yml` llamado `frontend-test-matrix` que use la estrategia de **matriz** para ejecutar los tests del frontend en varias combinaciones de sistema operativo y versión de Node.

### Requisitos

1. Añade el job al final del workflow
2. Matriz con al menos: `os: [ubuntu-24.04, macos-latest, windows-latest]` y `node: ['22', '24']`
3. El job debe descargar el código, llamar a la composite action (sin caché), y ejecutar `pnpm test:frontend`
4. El job **no debe bloquear** al resto del pipeline: es independiente
5. Verifica que aparecen múltiples ejecuciones del job (una por combinación) en la pestaña Actions

> **Nota**: ten en cuenta que Windows tiene peculiaridades con las rutas y con los comandos de shell. Si algo falla, lee bien el log de Windows.

---

## Verificar que todo funciona

1. **Instala las dependencias** del monorepo desde la raíz de `12-ejercicio-cicd/`:

   ```bash
   cd 12-ejercicio-cicd
   pnpm install
   ```

2. **Comprueba que los tests pasan en local**:

   ```bash
   pnpm test:frontend
   pnpm test:backend
   ```

3. **Comprueba que el lint pasa en local**:

   ```bash
   pnpm lint:frontend
   pnpm lint:backend
   ```

4. **Sube tus workflows** a GitHub y comprueba en la pestaña Actions que:
   - Los cinco workflows aparecen listados
   - `01-hello`, `02-manual`, `03-schedule` y `04-events` se pueden lanzar manualmente
   - `05-ci` se dispara en cada push a `main` y en cada PR

---

## Resumen de archivos a crear

```text
12-ejercicio-cicd/
└── .github/
    ├── workflows/
    │   ├── 01-hello.yml
    │   ├── 02-manual.yml
    │   ├── 03-schedule.yml
    │   ├── 04-events.yml
    │   ├── 05-ci.yml
    └── actions/
        └── setup-pnpm-ci-cd/
            └── action.yml
```

## ¿Dudas?

- Revisa las clases del módulo de CI/CD (clases 1 a 15)
- Pregunta en Discord
- Usa el archivo `dudas.md` para dejar tus dudas por escrito

¡Mucho éxito!
