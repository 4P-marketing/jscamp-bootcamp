# Ejercicio: Docker de principio a fin

¡Bienvenido al ejercicio final del módulo de **DevOps y Docker**! Ha llegado el momento de aplicar todo lo aprendido sobre Docker: el problema que resuelve, los Dockerfiles, las imágenes, los contenedores, la caché, el `.dockerignore`, las variables de entorno, y mucho más.

En este ejercicio vas a trabajar con **ocho pequeños proyectos** que cubren el recorrido completo del módulo. Cada proyecto vive en su propia carpeta para que puedas ver cómo Docker encaja en distintos escenarios.

---

## Tarea 1: "En mi máquina funciona" con Dockerfile

El primer paso del módulo fue entender el problema que Docker viene a resolver. En esta tarea vas a **crear tu primer Dockerfile** y a ver cómo una misma aplicación puede comportarse de forma muy distinta según la imagen base que elijas.

### Pasos

1. Entra en la carpeta `01-por-que/` y abre el archivo `app.js`. Léelo. Verás que usa `structuredClone` y `Array.prototype.findLast`, dos APIs de JavaScript modernas.
2. Crea un archivo `Dockerfile` en `01-por-que/` que ejecute el contenedor con la imagen `node:22-alpine` y que arranque el archivo `app.js` con Node. Recuerda: tu Dockerfile debe establecer un directorio de trabajo y copiar el `app.js` allí. Luego, vuelve a editar el `Dockerfile` para que la imagen base sea `node:16-alpine`, reconstruye y verás lo que pasa.
3. Construye las dos imágenes (con nombres distintos para no chocar) y ejecútalas:

```bash
 # Imagen con Node 22 → debería funcionar
 docker build -t por-que-node22 .
 docker run --rm por-que-node22

 # Cambia el FROM del Dockerfile a node:16-alpine, luego:

 # Imagen con Node 16 → debería petar
 docker build -t por-que-node16 .
 docker run --rm por-que-node16
```

### Verificación

- Con `node:22-alpine` verás el mensaje `✅ ¡Todo funcionó!`.
- Con `node:16-alpine` verás un `ReferenceError: structuredClone is not defined`.
- Mismo `app.js`, mismo `Dockerfile` (cambiando solo el `FROM`), comportamiento completamente distinto.

> **Conclusión**: el `FROM` del `Dockerfile` define el entorno. La aplicación viaja con sus dependencias, no con las de tu portátil.

---

## Tarea 2: Hola Docker

El ejemplo más pequeño posible. Crea un archivo `Dockerfile` en `02-hola-docker/` que ejecute el contenedor con la imagen `alpine` y que, al arrancar, imprima por consola el mensaje `Hola Docker`.

### Pasos

1. Crea el `Dockerfile` y luego constrúyelo y ejecútalo:

```bash
 docker build -t hola-docker .
 docker run --rm hola-docker
```

2. Verás `Hola Docker` en la consola.
3. Ahora cambia el mensaje a `Hola desde mi primera imagen` (modificando el `CMD` del `Dockerfile`), vuelve a construir y a ejecutar:

```bash
 docker build -t hola-docker .
 docker run --rm hola-docker
```

### Verificación

- La imagen se construye rápido (Alpine pesa muy poco).
- Como solo cambiaste el `CMD`, Docker **reutiliza la caché** de la capa `FROM alpine`. Lo verás en el output del `build`: esa capa dirá algo como `CACHED` o `Using cache`.

---

## Tarea 3: Tu primera app real con Node.js

Ahora la app es real: una API con Express que lee variables de entorno, expone un endpoint `/` y un endpoint `/health`. Tienes que escribir el Dockerfile siguiendo todas las buenas prácticas que vimos en el módulo.

### Pasos

1. Entra en `03-node-web/` y revisa los archivos:

- `server.js`: la API con Express
- `package.json`: define `express` como dependencia
- `package-lock.json`: el lockfile para que `npm ci` funcione

2. Crea un `Dockerfile` en `03-node-web/` que contenga, en este orden, las siguientes instrucciones:

- **Imagen base**: `node:22-alpine`.
- **Directorio de trabajo**: `/app`.
- **Copia de manifiestos**: copia **solo** `package.json` y `package-lock.json` a `/app`.
- **Instalación de dependencias**: ejecuta `npm ci`
- **Copia del código**: ahora sí, copia el resto de los archivos del proyecto.
- **Puerto documentado**: indica que la app escucha en el puerto 3000.
- **Usuario sin privilegios**: la app debe correr con el usuario `node`.
- **Comando de inicio**: el adecuado para arrancar `server.js` con Node.

3. Crea también un archivo `.dockerignore` en `03-node-web/` para evitar copiar archivos innecesarios al contexto de build. Debe incluir, como mínimo:

- `node_modules`.
- `.git` y `.gitignore`.
- Archivos de documentación (`*.md`).
- Archivos de variables de entorno (`.env`, `.env.`\*).
- Archivos propios del sistema operativo (`.DS_Store`).
- Configuraciones del editor (`.vscode`).

4. Construye la imagen:

```bash
 docker build -t midu-web .
```

5. Ejecuta el contenedor publicando el puerto:

```bash
 docker run --rm -p 3000:3000 --name midu-web midu-web
```

6. En otra terminal, prueba los endpoints:

```bash
 curl http://localhost:3000/
 curl http://localhost:3000/health
```

7. **Variables de entorno con `-e`**. Vuelve a lanzarlo pasando un saludo personalizado:

```bash
 docker run --rm -p 3000:3000 -e SALUDO="Hola Midus" --name midu-web midu-web
```

Ahora `curl http://localhost:3000/` debería devolver `"mensaje": "Hola Midus"`. 8. **Variables de entorno con `--env-file`**. Crea un archivo `03-node-web/.env`:

```text
 SALUDO=Hola desde .env
 PORT=3000
```

Lanza el contenedor con: 9. **Comprueba la caché de Docker**. Modifica una línea de `server.js` (por ejemplo, cambia el mensaje por defecto). Vuelve a construir:

```bash
 docker build -t midu-web .
```

Verás que las capas del manifiesto y de `npm ci` salen como `CACHED` (no se reinstalan las dependencias). Solo se reconstruyen las capas a partir del `COPY` del código. 10. Limpia los contenedores e imágenes que ya no necesites:

```bash
  docker stop midu-web
  docker rm midu-web
```

---

## Tarea 4: `docker init` en acción

En la Tarea 3 escribiste tu Dockerfile a mano. Ahora vas a ver cómo lo haría Docker por ti con `docker init`.

Tu tarea será ejecutar `docker init` dentro de la carpeta `04-docker-init/` y dejar configurados los archivos iniciales (Dockerfile, `.dockerignore` y `compose.yaml`) que la herramienta genera.

---

## Tarea 5: Dockerfile multipaso

Las apps reales no siempre se ejecutan tal cual: muchas pasan por un paso de compilación. Los **Dockerfiles multipaso** (multi-stage) separan la etapa de **build** de la etapa de **runtime** para producir imágenes finales más pequeñas y limpias.

En esta tarea tienes una app Node que importa `canvas-confetti` y se compila con `esbuild` (que está en `devDependencies`). El `package.json` ya tiene el script `build` listo.

### Pasos

1. Entra en `05-multi-stage/` y revisa los archivos. Fíjate en que el script `build` genera un bundle en `dist/`.
2. Crea un `Dockerfile` en `05-multi-stage/` con **dos etapas** usando `FROM ... AS ...`:

- **Etapa `builder`**: usa `node:22-alpine` como base, instala **todas** las dependencias (incluidas las de desarrollo) con `npm ci` y compila la app ejecutando `npm run build`. El bundle queda en `/app/dist`.
- **Etapa `runner`**: parte también de `node:22-alpine`, establece `NODE_ENV=production`, copia **solo** la carpeta `dist/` desde la etapa `builder` (con `COPY --from=builder`), expone el puerto 3000, ejecuta con el usuario `node` y define el comando de inicio apuntando al bundle compilado.

3. Construye la imagen, ejecútala y comprueba que responde:

```bash
 docker build -t midu-mini .
 docker run --rm -p 3000:3000 --name midu-mini midu-mini
 # en otra terminal:
 curl http://localhost:3000/
```

Deberías ver un JSON que dice "Imagen mínima creada con multi-stage build". 4. **Verifica el contenido de la imagen final**. Abre una shell dentro del contenedor y comprueba que solo está lo imprescindible:

```bash
 docker exec -it midu-mini sh
 ls -la /app
 # solo debería aparecer dist/
 # NO deberían aparecer ni src/ ni node_modules/ ni package.json
 exit
 docker stop midu-mini
 docker rm midu-mini
```

### Verificación

- La etapa `builder` instala **todas** las dependencias (incluyendo `devDependencies` con `esbuild`) y compila la app.
- La etapa `runner` solo copia `dist/` desde el builder: no tiene `esbuild` ni el código fuente.

> **Conclusión**: cuando tu app requiera un paso de build, usa siempre un Dockerfile multipaso. La imagen final será más pequeña, más segura y más rápida de transferir.

---

## Tarea 6: Volúmenes y bind mounts

Los contenedores son **efímeros**: si los eliminas, los datos que generaron desaparecen con ellos. En esta tarea vas a ver este problema en directo y a solucionarlo de dos formas: con un **Docker Volume** y con un **bind mount**.

El `Dockerfile` ya te lo dejamos escrito en `06-volumenes/`. Fíjate en que es muy simple: solo copia `server.js` y expone el 3000. La gracia de esta tarea está en cómo persistes los datos.

### Pasos

1. Entra en `06-volumenes/`, revisa `server.js` y construye la imagen:

```bash
 cd 06-volumenes
 docker build -t midu-visitas .
 cd ..
```

2. **Demuestra que el contenedor es efímero**. Lanza el contenedor, sube el contador con `curl http://localhost:3000/visitar`, detenlo (`Ctrl + C`), vuelve a lanzarlo y comprueba con `curl http://localhost:3000/` que el contador está a 0. Los datos se han perdido porque vivían dentro del contenedor.
3. **Solución con Docker Volume**. Crea un volumen y móntalo en `/app/data` (la ruta donde `server.js` lee y escribe `visitas.txt`):

```bash
 docker volume create visitas-data
 docker run --rm -p 3000:3000 \
   -v visitas-data:/app/data \
   --name midu-visitas \
   midu-visitas
```

Sube el contador con `curl /visitar`, detén el contenedor y vuelve a lanzarlo con el mismo volumen. Esta vez el contador persiste aunque el contenedor se haya eliminado. 4. **Solución con bind mount para desarrollo**. Modifica el `Dockerfile` de `06-volumenes/` para que el comando de inicio use `node --watch` (en vez de solo `node`), de forma que cuando edites un archivo del proyecto (gracias al bind mount), Node se reinicie automáticamente. Vuelve a construir y lánzalo con un bind mount que apunte a la carpeta `data/` del proyecto:

```bash
 docker build -t midu-visitas .
 docker run --rm -p 3000:3000 \
   -v "$(pwd)/06-volumenes/data:/app/data" \
   --name midu-visitas \
   midu-visitas
```

Edita `server.js` desde tu editor (cambia el mensaje, por ejemplo). Verás en los logs que Node se reinicia automáticamente con `--watch`. Refresca `curl http://localhost:3000/` y verás el cambio. 5. Limpia:

```bash
 docker stop midu-visitas
 docker rm midu-visitas
 docker volume rm visitas-data
```

### Verificación

- Sin volumen ni bind mount, los datos se pierden al eliminar el contenedor.
- Con un **Docker Volume** (`docker volume create` + `-v nombre-volumen:/app/data`), los datos persisten aunque elimines el contenedor.
- Con un **bind mount** combinado con `node --watch`, tienes **hot reload**: editas el código en tu editor y el contenedor lo ve al instante.

> **Conclusión**: usa **Docker Volumes** para datos persistentes y **bind mounts** para desarrollo local con hot reload.

---

## Tarea 7 (Opcional): Docker con IA local

Docker también puede ejecutar modelos de inteligencia artificial en local mediante **Docker Model Runner**. En esta tarea opcional vas a dockerizar una app Flask que se conecta a ese modelo.

### Pasos

1. Entra en `07-ia-OPCIONAL/` y revisa los archivos: `app.py` (Flask que usa el SDK de OpenAI apuntando a `http://model-runner.docker.internal/v1/`) y `requirements.txt` (`flask` y `openai`).
2. Crea un `Dockerfile` en `07-ia-OPCIONAL/` que:

- Use `python:3.12-slim` como imagen base.
- Establezca `/app` como directorio de trabajo.
- Copie primero `requirements.txt` e instale las dependencias con `pip install --no-cache-dir` (el flag `--no-cache-dir` evita que pip guarde caché de descargas, manteniendo la imagen más pequeña).
- Copie `app.py` al directorio de trabajo.
- Documente que la app escucha en el puerto 5000.
- Defina el comando de inicio con `python app.py`.

3. Descarga el modelo, construye, ejecuta y prueba:

```bash
 docker model pull ai/smollm2
 docker build -t midu-ia .
 docker run --rm -p 5000:5000 --name midu-ia midu-ia
 # en otra terminal:
 curl http://localhost:5000/
 curl "http://localhost:5000/ask?q=What+is+a+Docker+container+in+one+sentence"
```

4. Limpia:

```bash
 docker stop midu-ia
 docker rm midu-ia
```

### Verificación

- La app se conecta a `http://model-runner.docker.internal/v1/`, una URL especial que Docker expone para que los contenedores consuman modelos instalados en el host.
- Si ves un error 500 con el mensaje de "asegúrate de haber corrido `docker model pull`", es que se te olvidó descargar el modelo.

> **Nota**: esta tarea es opcional. No es necesaria para completar el ejercicio, pero te da una idea de cómo Docker se integra con el mundo de la IA local.

---

## Tarea 8 (Opcional): Despliegue en Vercel

Vercel también acepta Dockerfiles, así que puedes desplegar aplicaciones escritas en cualquier lenguaje. En esta tarea vas a crear un `Dockerfile.vercel` multipaso para una pequeña app en Go.

### Pasos

1. Entra en `08-vercel-OPCIONAL/` y revisa `main.go`. Es un servidor HTTP minimalista en Go que escucha en el puerto que le pases por la variable de entorno `PORT` (o 80 por defecto).
2. Crea un archivo `Dockerfile.vercel` (ojo: con ese nombre exacto, no `Dockerfile`) en `08-vercel-OPCIONAL/` con dos etapas usando `FROM ... AS ...`:

- **Etapa `builder`**: usa `golang:1.24-alpine` como base, copia todo el código fuente y compila el binario con `go build -o /server main.go`.
- **Etapa `runner`**: parte de `alpine:3.20` (mucho más ligera), copia **solo** el binario desde la etapa `builder` y lo ejecuta como comando de inicio.

3. **Pruébalo en local** antes de desplegar:

```bash
 docker build -f Dockerfile.vercel -t midu-vercel .
 docker run --rm -p 8080:80 -e PORT=80 --name midu-vercel midu-vercel
 # en otra terminal:
 curl http://localhost:8080/
 # ver "Hello from a container on Vercel 👋"
 docker stop midu-vercel
 docker rm midu-vercel
```

4. **Despliegue en Vercel (opcional)**. Si quieres desplegarlo de verdad, instala la CLI, haz login y despliega:

```bash
 npm i -g vercel
 vercel login
 vercel
```

Vercel detectará `Dockerfile.vercel`, construirá la imagen y la desplegará.

### Verificación

- El `Dockerfile.vercel` es multipaso: compila Go en una imagen con el toolchain y copia solo el binario a una imagen Alpine final.
- El mismo `Dockerfile.vercel` sirve tanto para producción (Vercel) como para probarlo en local con `docker build -f Dockerfile.vercel`.

> **Nota**: desplegar en Vercel puede requerir una cuenta y, según el plan, tener coste. Esta parte es 100% opcional.

## Verificar que todo funciona

Después de completar las tareas obligatorias (1 a 6) deberías saber:

- Por qué Docker existe y qué problema resuelve.
- Cómo escribir un Dockerfile básico, otro con buenas prácticas, otro multipaso.
- Cómo aprovechar la caché de Docker, usar `.dockerignore` y `USER`.
- Cómo pasar variables de entorno con `-e` y `--env-file`.
- Cómo publicar una imagen en Docker Hub con tags (bonus).
- Qué hace `docker init` y cómo aprovecharlo.
- Cómo funcionan los Docker Volumes y los bind mounts.

Si quieres ir más allá, las tareas opcionales (7 y 8) te dan un primer contacto con la IA local y el despliegue en Vercel.

## ¿Dudas?

- Revisa las clases del módulo de DevOps y Docker.
- Pregunta en Discord
- Usa el archivo `dudas.md` para dejar tus dudas por escrito

¡Mucho éxito!
